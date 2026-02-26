import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Auth Service - Admin Panel
 */

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
      role: z.enum(['ADMIN', 'SUPERADMIN']),
    }),
  }),
  timestamp: z.string(),
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    const validated = authLoginSchema.parse(credentials);
    const response = await apiClient.post('/auth/login', validated);
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
          role: z.enum(['ADMIN', 'SUPERADMIN']),
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
}
