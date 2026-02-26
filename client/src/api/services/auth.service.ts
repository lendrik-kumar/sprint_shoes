import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Auth Service - Client
 */

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const authResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      avatar: z.string().optional(),
      role: z.enum(['CUSTOMER', 'ADMIN', 'SUPERADMIN']),
    }),
  }),
  timestamp: z.string(),
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export class ClientAuthService {
  static async login(credentials: LoginCredentials) {
    const validated = authLoginSchema.parse(credentials);
    const response = await apiClient.post('/auth/login', validated);
    return authResponseSchema.parse(response.data);
  }

  static async register(credentials: RegisterCredentials) {
    const validated = authRegisterSchema.parse(credentials);
    const response = await apiClient.post('/auth/register', validated);
    return authResponseSchema.parse(response.data);
  }

  static async refresh(payload: RefreshTokenPayload) {
    const response = await apiClient.post('/auth/refresh', payload);
    return authResponseSchema.parse(response.data);
  }

  static async logout() {
    const response = await apiClient.post('/auth/logout');
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async getMe() {
    const response = await apiClient.get('/auth/me');
    return z
      .object({
        success: z.boolean(),
        data: z.object({
          id: z.string(),
          email: z.string(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          avatar: z.string().optional(),
          role: z.enum(['CUSTOMER', 'ADMIN', 'SUPERADMIN']),
        }),
      })
      .parse(response.data);
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async verifyEmail(token: string) {
    const response = await apiClient.post('/auth/verify-email', { token });
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async requestPasswordReset(email: string) {
    const response = await apiClient.post('/auth/request-password-reset', { email });
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async resetPassword(token: string, password: string) {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }
}
