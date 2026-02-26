import apiClient from '@services/api';

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    resetPassword: '/auth/password-reset/initiate',
    confirmReset: '/auth/password-reset/confirm',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    categories: '/categories',
    search: '/products/search',
  },
  cart: {
    get: '/cart',
    add: '/cart/add',
    remove: (id: string) => `/cart/remove/${id}`,
    update: (id: string) => `/cart/${id}`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  user: {
    profile: '/profile',
    addresses: '/addresses',
  },
};

export const productService = {
  getProducts: (page: number = 1, limit: number = 10) =>
    apiClient.get(apiEndpoints.products.list, { params: { page, limit } }),

  getProductById: (id: string) => apiClient.get(apiEndpoints.products.detail(id)),

  getCategories: () => apiClient.get(apiEndpoints.products.categories),

  searchProducts: (query: string, page: number = 1) =>
    apiClient.get(apiEndpoints.products.search, { params: { q: query, page } }),
};

export const orderService = {
  createOrder: (shippingAddress: string, paymentMethod: string) =>
    apiClient.post(apiEndpoints.orders.create, { shippingAddress, paymentMethod }),

  getOrders: (page: number = 1) => apiClient.get(apiEndpoints.orders.list, { params: { page } }),

  getOrderById: (id: string) => apiClient.get(apiEndpoints.orders.detail(id)),

  cancelOrder: (id: string) => apiClient.post(apiEndpoints.orders.cancel(id)),
};

export const userService = {
  getProfile: () => apiClient.get(apiEndpoints.user.profile),

  getAddresses: () => apiClient.get(apiEndpoints.user.addresses),
};
