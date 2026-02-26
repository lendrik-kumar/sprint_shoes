import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from '@config/env';
import { TokenPayload } from '../types';
import { AuthenticationError } from './errors';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry as any,
  });
};

export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry as any,
  });
};

export const generateResetToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.resetSecret, {
    expiresIn: '24h' as any,
  });
};

export const generateOTPToken = (phoneNumber: string): string => {
  return jwt.sign({ phoneNumber }, config.jwt.otpSecret, {
    expiresIn: config.jwt.otpExpiry as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
};

export const verifyResetToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.resetSecret) as TokenPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired reset token');
  }
};

export const verifyOTPToken = (token: string): { phoneNumber: string } => {
  try {
    const decoded = jwt.verify(token, config.jwt.otpSecret) as { phoneNumber: string };
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired OTP token');
  }
};

export const generateRandomBytes = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const hashOTP = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};
