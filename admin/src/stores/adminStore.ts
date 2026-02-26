import { create } from 'zustand';
import { User, Product, Order, ApiError, DashboardStats, AuditLog } from '@/types';
import {
  adminDashboardApi,
  adminUserApi,
  adminProductApi,
  adminOrderApi,
  adminAuditApi,
} from '@/api';

interface AdminState {
  // Dashboard
  stats: DashboardStats | null;
  isLoadingStats: boolean;
  statsError: ApiError | null;

  // Users
  users: User[];
  selectedUser: User | null;
  isLoadingUsers: boolean;
  usersError: ApiError | null;
  usersPagination: { page: number; limit: number; total: number; pages: number } | null;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  isLoadingProducts: boolean;
  productsError: ApiError | null;
  productsPagination: { page: number; limit: number; total: number; pages: number } | null;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  isLoadingOrders: boolean;
  ordersError: ApiError | null;
  ordersPagination: { page: number; limit: number; total: number; pages: number } | null;

  // Audit Logs
  auditLogs: AuditLog[];
  isLoadingAuditLogs: boolean;
  auditLogsError: ApiError | null;
  auditLogsPagination: { page: number; limit: number; total: number; pages: number } | null;

  // Dashboard actions
  fetchStats: () => Promise<void>;

  // User actions
  fetchUsers: (page?: number, limit?: number, search?: string) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearSelectedUser: () => void;

  // Product actions
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateInventory: (id: string, quantity: number) => Promise<void>;
  clearSelectedProduct: () => void;

  // Order actions
  fetchOrders: (page?: number, limit?: number, status?: any) => Promise<void>;
  getOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  processRefund: (id: string, reason: string) => Promise<void>;
  clearSelectedOrder: () => void;

  // Audit actions
  fetchAuditLogs: (page?: number, limit?: number, filters?: any) => Promise<void>;
  getAuditLogById: (id: string) => Promise<void>;

  // Error management
  clearError: (errorType: 'stats' | 'users' | 'products' | 'orders' | 'auditLogs') => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  stats: null,
  isLoadingStats: false,
  statsError: null,

  users: [],
  selectedUser: null,
  isLoadingUsers: false,
  usersError: null,
  usersPagination: null,

  products: [],
  selectedProduct: null,
  isLoadingProducts: false,
  productsError: null,
  productsPagination: null,

  orders: [],
  selectedOrder: null,
  isLoadingOrders: false,
  ordersError: null,
  ordersPagination: null,

  auditLogs: [],
  isLoadingAuditLogs: false,
  auditLogsError: null,
  auditLogsPagination: null,

  // Dashboard actions
  fetchStats: async () => {
    set({ isLoadingStats: true, statsError: null });
    try {
      const { data }: any = await adminDashboardApi.getStats();
      if (data.success) {
        set({ stats: data.data as any, isLoadingStats: false });
      }
    } catch (err: any) {
      set({
        statsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch stats',
          code: err?.response?.data?.code,
        },
        isLoadingStats: false,
      });
    }
  },

  // User actions
  fetchUsers: async (page = 1, limit = 10, search?: string) => {
    set({ isLoadingUsers: true, usersError: null });
    try {
      const { data }: any = await adminUserApi.getUsers(page, limit, search);
      if (data.success) {
        set({
          users: data.data,
          usersPagination: {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            pages: data.pagination.pages,
          },
          isLoadingUsers: false,
        });
      }
    } catch (err: any) {
      set({
        usersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch users',
          code: err?.response?.data?.code,
        },
        isLoadingUsers: false,
      });
    }
  },

  getUserById: async (id: string) => {
    set({ isLoadingUsers: true, usersError: null });
    try {
      const { data }: any = await adminUserApi.getUserById(id);
      if (data.success) {
        set({
          selectedUser: data.data,
          isLoadingUsers: false,
        });
      }
    } catch (err: any) {
      set({
        usersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch user',
          code: err?.response?.data?.code,
        },
        isLoadingUsers: false,
      });
      throw err;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    set({ isLoadingUsers: true, usersError: null });
    try {
      const { data }: any = await adminUserApi.updateUser(id, userData);
      if (data.success) {
        // Update in users list
        const updatedUsers = get().users.map((u) => (u.id === id ? data.data : u));
        set({
          users: updatedUsers,
          selectedUser: data.data,
          isLoadingUsers: false,
        });
      }
    } catch (err: any) {
      set({
        usersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to update user',
          code: err?.response?.data?.code,
        },
        isLoadingUsers: false,
      });
      throw err;
    }
  },

  deactivateUser: async (id: string) => {
    set({ isLoadingUsers: true, usersError: null });
    try {
      const { data }: any = await adminUserApi.updateUser(id, { isActive: false });
      if (data.success) {
        // Update in users list with isActive = false
        const updatedUsers = get().users.map((u) => (u.id === id ? { ...u, isActive: false } : u));
        set({
          users: updatedUsers,
          isLoadingUsers: false,
        });
      }
    } catch (err: any) {
      set({
        usersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to deactivate user',
          code: err?.response?.data?.code,
        },
        isLoadingUsers: false,
      });
      throw err;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoadingUsers: true, usersError: null });
    try {
      const { data }: any = await adminUserApi.deleteUser(id);
      if (data.success) {
        // Remove from users list
        const updatedUsers = get().users.filter((u) => u.id !== id);
        set({
          users: updatedUsers,
          selectedUser: get().selectedUser?.id === id ? null : get().selectedUser,
          isLoadingUsers: false,
        });
      }
    } catch (err: any) {
      set({
        usersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to delete user',
          code: err?.response?.data?.code,
        },
        isLoadingUsers: false,
      });
      throw err;
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),

  // Product actions
  fetchProducts: async (page = 1, limit = 10) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const { data }: any = await adminProductApi.getProducts(page, limit);
      if (data.success) {
        set({
          products: data.data,
          productsPagination: {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            pages: data.pagination.pages,
          },
          isLoadingProducts: false,
        });
      }
    } catch (err: any) {
      set({
        productsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch products',
          code: err?.response?.data?.code,
        },
        isLoadingProducts: false,
      });
    }
  },

  getProductById: async (id: string) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const { data }: any = await adminProductApi.getProductById(id);
      if (data.success) {
        set({
          selectedProduct: data.data,
          isLoadingProducts: false,
        });
      }
    } catch (err: any) {
      set({
        productsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch product',
          code: err?.response?.data?.code,
        },
        isLoadingProducts: false,
      });
      throw err;
    }
  },

  createProduct: async (productData: Partial<Product>) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const { data }: any = await adminProductApi.createProduct(productData);
      if (data.success) {
        set({
          products: [data.data, ...get().products],
          selectedProduct: data.data,
          isLoadingProducts: false,
        });
      }
    } catch (err: any) {
      set({
        productsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to create product',
          code: err?.response?.data?.code,
        },
        isLoadingProducts: false,
      });
      throw err;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const { data }: any = await adminProductApi.updateProduct(id, productData);
      if (data.success) {
        const updatedProducts = get().products.map((p) => (p.id === id ? data.data : p));
        set({
          products: updatedProducts,
          selectedProduct: data.data,
          isLoadingProducts: false,
        });
      }
    } catch (err: any) {
      set({
        productsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to update product',
          code: err?.response?.data?.code,
        },
        isLoadingProducts: false,
      });
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const { data }: any = await adminProductApi.deleteProduct(id);
      if (data.success) {
        const updatedProducts = get().products.filter((p) => p.id !== id);
        set({
          products: updatedProducts,
          selectedProduct: get().selectedProduct?.id === id ? null : get().selectedProduct,
          isLoadingProducts: false,
        });
      }
    } catch (err: any) {
      set({
        productsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to delete product',
          code: err?.response?.data?.code,
        },
        isLoadingProducts: false,
      });
      throw err;
    }
  },

  updateInventory: async (id: string, quantity: number) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const { data }: any = await adminProductApi.updateInventory(id, quantity);
      if (data.success) {
        const updatedProducts = get().products.map((p) =>
          p.id === id ? { ...p, stock: quantity } : p
        );
        set({
          products: updatedProducts,
          isLoadingProducts: false,
        });
      }
    } catch (err: any) {
      set({
        productsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to update inventory',
          code: err?.response?.data?.code,
        },
        isLoadingProducts: false,
      });
      throw err;
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),

  // Order actions
  fetchOrders: async (page = 1, limit = 10, status?: string) => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const { data }: any = await adminOrderApi.getOrders(page, limit, status as any);
      if (data.success) {
        set({
          orders: data.data,
          ordersPagination: {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            pages: data.pagination.pages,
          },
          isLoadingOrders: false,
        });
      }
    } catch (err: any) {
      set({
        ordersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch orders',
          code: err?.response?.data?.code,
        },
        isLoadingOrders: false,
      });
    }
  },

  getOrderById: async (id: string) => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const { data }: any = await adminOrderApi.getOrderById(id);
      if (data.success) {
        set({
          selectedOrder: data.data,
          isLoadingOrders: false,
        });
      }
    } catch (err: any) {
      set({
        ordersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch order',
          code: err?.response?.data?.code,
        },
        isLoadingOrders: false,
      });
      throw err;
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const { data }: any = await adminOrderApi.updateOrderStatus(id, status as any);
      if (data.success) {
        const updatedOrders = get().orders.map((o) => (o.id === id ? data.data : o));
        set({
          orders: updatedOrders,
          selectedOrder: data.data,
          isLoadingOrders: false,
        });
      }
    } catch (err: any) {
      set({
        ordersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to update order status',
          code: err?.response?.data?.code,
        },
        isLoadingOrders: false,
      });
      throw err;
    }
  },

  processRefund: async (id: string, reason: string) => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const { data }: any = await adminOrderApi.processRefund(id, reason);
      if (data.success) {
        const updatedOrders = get().orders.map((o) => (o.id === id ? data.data : o));
        set({
          orders: updatedOrders,
          isLoadingOrders: false,
        });
      }
    } catch (err: any) {
      set({
        ordersError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to process refund',
          code: err?.response?.data?.code,
        },
        isLoadingOrders: false,
      });
      throw err;
    }
  },

  clearSelectedOrder: () => set({ selectedOrder: null }),

  // Audit actions
  fetchAuditLogs: async (page = 1, limit = 10, filters?: any) => {
    set({ isLoadingAuditLogs: true, auditLogsError: null });
    try {
      const { data }: any = await adminAuditApi.getAuditLogs(page, limit, filters);
      if (data.success) {
        set({
          auditLogs: data.data as any,
          auditLogsPagination: {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            pages: data.pagination.pages,
          },
          isLoadingAuditLogs: false,
        });
      }
    } catch (err: any) {
      set({
        auditLogsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch audit logs',
          code: err?.response?.data?.code,
        },
        isLoadingAuditLogs: false,
      });
    }
  },

  getAuditLogById: async (id: string) => {
    set({ isLoadingAuditLogs: true, auditLogsError: null });
    try {
      const { data }: any = await adminAuditApi.getAuditLogById(id);
      if (data.success) {
        // Audit logs are typically read-only, just set in state
        set({ isLoadingAuditLogs: false });
      }
    } catch (err: any) {
      set({
        auditLogsError: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch audit log',
          code: err?.response?.data?.code,
        },
        isLoadingAuditLogs: false,
      });
      throw err;
    }
  },

  // Error management
  clearError: (errorType: 'stats' | 'users' | 'products' | 'orders' | 'auditLogs') => {
    const errorKey = `${errorType}Error` as const;
    set({ [errorKey]: null });
  },
}));
