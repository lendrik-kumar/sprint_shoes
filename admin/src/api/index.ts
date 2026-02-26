import { apiClient } from './client';
import type {
  ApiResponse,
  User,
  Product,
  Order,
  OrderStatus,
  Address,
} from '@/types';
import type { DashboardStats } from '@/stores/dashboardAdminStore';
import type { AuditLog } from '@/stores/auditAdminStore';

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      '/auth/login',
      { email, password },
    ),

  register: (email: string, password: string, firstName: string, lastName: string) =>
    apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      '/auth/register',
      { email, password, firstName, lastName },
    ),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
      refreshToken,
    }),
};

// ─── Admin Dashboard ────────────────────────────────────────────────────────
export const adminDashboardApi = {
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/admin/stats'),
};

// ─── Admin Users ────────────────────────────────────────────────────────────
type UserListResponse = {
  success: boolean;
  data: User[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export const adminUserApi = {
  getUsers: (page = 1, limit = 10, search?: string) =>
    apiClient.get<UserListResponse>('/admin/users', { params: { page, limit, search } }),

  getUserById: (id: string) => apiClient.get<ApiResponse<User>>(`/admin/users/${id}`),

  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data),

  deleteUser: (id: string) => apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`),
};

// ─── Admin Products ─────────────────────────────────────────────────────────
type ProductListResponse = {
  success: boolean;
  data: Product[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export const adminProductApi = {
  getProducts: (page = 1, limit = 10, search?: string) =>
    apiClient.get<ProductListResponse>('/admin/products', { params: { page, limit, search } }),

  getProductById: (id: string) => apiClient.get<ApiResponse<Product>>(`/admin/products/${id}`),

  createProduct: (data: Partial<Product>) =>
    apiClient.post<ApiResponse<Product>>('/admin/products', data),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, data),

  deleteProduct: (id: string) => apiClient.delete<ApiResponse<null>>(`/admin/products/${id}`),

  updateInventory: (id: string, quantity: number) =>
    apiClient.patch<ApiResponse<Product>>(`/admin/products/${id}/inventory`, { quantity }),
};

// ─── Admin Orders ───────────────────────────────────────────────────────────
type OrderListResponse = {
  success: boolean;
  data: Order[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export const adminOrderApi = {
  getOrders: (page = 1, limit = 10, status?: OrderStatus) =>
    apiClient.get<OrderListResponse>('/admin/orders', { params: { page, limit, status } }),

  getOrderById: (id: string) => apiClient.get<ApiResponse<Order>>(`/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    apiClient.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),

  processRefund: (id: string, reason: string) =>
    apiClient.post<ApiResponse<Order>>(`/admin/orders/${id}/refund`, { reason }),
};

// ─── Admin Audit Logs ───────────────────────────────────────────────────────
type AuditFilters = { search?: string; action?: string; startDate?: string; endDate?: string };
type AuditListResponse = {
  success: boolean;
  data: AuditLog[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export const adminAuditApi = {
  getAuditLogs: (page = 1, limit = 20, filters?: AuditFilters) =>
    apiClient.get<AuditListResponse>('/admin/audit-logs', { params: { page, limit, ...filters } }),

  getAuditLogById: (id: string) => apiClient.get<ApiResponse<AuditLog>>(`/admin/audit-logs/${id}`),
};

// ─── Admin Profile Addresses ────────────────────────────────────────────────
export const profileApi = {
  getProfile: () => apiClient.get<ApiResponse<User>>('/profile'),
  updateProfile: (data: Partial<User>) => apiClient.put<ApiResponse<User>>('/profile', data),
  getAddresses: () => apiClient.get<ApiResponse<Address[]>>('/profile/addresses'),
  addAddress: (address: Omit<Address, 'id'>) =>
    apiClient.post<ApiResponse<Address>>('/profile/addresses', address),
  updateAddress: (id: string, address: Partial<Address>) =>
    apiClient.put<ApiResponse<Address>>(`/profile/addresses/${id}`, address),
  deleteAddress: (id: string) => apiClient.delete<ApiResponse<null>>(`/profile/addresses/${id}`),
};
