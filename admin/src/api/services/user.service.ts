import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Admin User Service
 */

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN', 'SUPERADMIN']),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const paginatedUsersSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(userSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
  timestamp: z.string(),
});

export type User = z.infer<typeof userSchema>;

export class AdminUserService {
  static async getUsers(page = 1, limit = 10, search?: string, role?: string) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
      ...(role && { role }),
    });
    const response = await apiClient.get(`/admin/users?${params}`);
    return paginatedUsersSchema.parse(response.data);
  }

  static async getUserById(id: string) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return z
      .object({
        success: z.boolean(),
        data: userSchema,
      })
      .parse(response.data);
  }

  static async updateUser(id: string, data: Partial<typeof userSchema>) {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return z
      .object({
        success: z.boolean(),
        data: userSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async changeUserRole(id: string, role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN') {
    const response = await apiClient.patch(`/admin/users/${id}/role`, { role });
    return z
      .object({
        success: z.boolean(),
        data: userSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async toggleUserStatus(id: string, isActive: boolean) {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
    return z
      .object({
        success: z.boolean(),
        data: userSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async deleteUser(id: string) {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }
}
