import { apiClient } from './client';
import type { ApiResponse, User, PaginatedResponse } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      '/auth/login',
      {
        email,
        password,
      }
    ),

  register: (email: string, password: string, firstName: string, lastName: string) =>
    apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      '/auth/register',
      {
        email,
        password,
        firstName,
        lastName,
      }
    ),

  logout: () => apiClient.post('/auth/logout'),

  getCurrentUser: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
      refreshToken,
    }),
};

export const profileApi = {
  getProfile: () => apiClient.get<ApiResponse<User>>('/profile'),

  updateProfile: (data: Partial<User>) => apiClient.put<ApiResponse<User>>('/profile', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/profile/change-password', { oldPassword, newPassword }),

  addAddress: (address: any) => apiClient.post('/profile/addresses', address),

  updateAddress: (addressId: string, address: any) =>
    apiClient.put(`/profile/addresses/${addressId}`, address),

  deleteAddress: (addressId: string) => apiClient.delete(`/profile/addresses/${addressId}`),

  getAddresses: () => apiClient.get('/profile/addresses'),
};

export const productApi = {
  getProducts: (page = 1, limit = 10, filters?: any) =>
    apiClient.get<PaginatedResponse<any>>('/products', {
      params: { page, limit, ...filters },
    }),

  getProductById: (id: string) => apiClient.get(`/products/${id}`),

  searchProducts: (query: string, page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<any>>('/products/search', {
      params: { q: query, page, limit },
    }),
};

export const cartApi = {
  getCart: () => apiClient.get('/cart'),

  addToCart: (productId: string, quantity: number, variantId?: string) =>
    apiClient.post('/cart/add', { productId, quantity, variantId }),

  updateCartItem: (cartItemId: string, quantity: number) =>
    apiClient.put(`/cart/items/${cartItemId}`, { quantity }),

  removeFromCart: (cartItemId: string) => apiClient.delete(`/cart/items/${cartItemId}`),

  clearCart: () => apiClient.delete('/cart'),
};

export const orderApi = {
  createOrder: (orderData: any) => apiClient.post('/orders', orderData),

  getOrders: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<any>>('/orders', {
      params: { page, limit },
    }),

  getOrderById: (id: string) => apiClient.get(`/orders/${id}`),

  cancelOrder: (id: string) => apiClient.post(`/orders/${id}/cancel`, {}),

  getOrderStatus: (id: string) => apiClient.get(`/orders/${id}/status`),
};
