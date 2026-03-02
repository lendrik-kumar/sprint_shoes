import { prisma } from '@config/database';
import { redis, CACHE_KEYS } from '@utils/redis';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  generateOTPToken,
  hashPassword,
  comparePasswords,
  generateOTP,
  hashOTP,
  verifyRefreshToken,
  verifyResetToken,
  verifyOTPToken,
} from '@utils/crypto';
import { ConflictError, NotFoundError, AuthenticationError, AppError } from '@utils/errors';
import { config } from '@config/env';
import { UserRole, TokenPayload } from '@types';

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError(`User with email ${input.email} already exists`);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role as UserRole);
    return tokens;
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const passwordMatch = await comparePasswords(input.password, user.passwordHash);
    if (!passwordMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account has been deactivated');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role as UserRole);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or account is inactive');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role as UserRole);
    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await prisma.refreshToken
      .update({
        where: { token: refreshToken },
        data: { revokedAt: new Date() },
      })
      .catch(() => {
        // Refresh token might not exist or already revoked
      });

    await redis.del(CACHE_KEYS.SESSION(userId));
  }

  async initiatePasswordReset(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const resetToken = generateResetToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = verifyResetToken(token);

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired reset token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const passwordHash = await hashPassword(newPassword);

    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);
  }

  async initiatePhoneOTP(userId: string, phone: string): Promise<string> {
    const otp = generateOTP(config.otp.length);
    const otpHash = hashOTP(otp);

    await prisma.oTPAttempt.create({
      data: {
        userId,
        phone,
        otpHash,
        expiresAt: new Date(Date.now() + config.otp.validityMinutes * 60 * 1000),
      },
    });

    const otpToken = generateOTPToken(phone);

    await redis.set(CACHE_KEYS.OTP(phone), otp, config.otp.validityMinutes * 60);

    return otp;
  }

  async verifyPhoneOTP(token: string, otp: string): Promise<void> {
    const decoded = verifyOTPToken(token);

    const cachedOTP = await redis.get(CACHE_KEYS.OTP(decoded.phoneNumber));

    if (!cachedOTP || cachedOTP !== otp) {
      throw new AuthenticationError('Invalid OTP');
    }

    const otpAttempt = await prisma.oTPAttempt.findFirst({
      where: {
        phone: decoded.phoneNumber,
        verifiedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpAttempt) {
      throw new AuthenticationError('OTP not found');
    }

    await Promise.all([
      prisma.oTPAttempt.update({
        where: { id: otpAttempt.id },
        data: { verifiedAt: new Date() },
      }),
      redis.del(CACHE_KEYS.OTP(decoded.phoneNumber)),
    ]);
  }

  private generateTokens(userId: string, email: string, role: UserRole): AuthTokens {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId,
      email,
      role,
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }
}

export const authService = new AuthService();
