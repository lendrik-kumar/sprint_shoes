import { create } from 'zustand';
import type { Order, OrderStatus, ApiError } from '@/types';
import { adminOrderApi } from '@/api';

type Pagination = { page: number; limit: number; total: number; pages: number };

interface OrderAdminState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;

  fetchOrders: (page?: number, limit?: number, status?: OrderStatus) => Promise<void>;
  getOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  processRefund: (id: string, reason: string) => Promise<void>;
  clearSelectedOrder: () => void;
  clearError: () => void;
}

const handleError = (err: unknown): ApiError => {
  const e = err as { response?: { data?: { message?: string; code?: string } } };
  return {
    success: false,
    message: e?.response?.data?.message ?? 'An error occurred',
    code: e?.response?.data?.code,
  };
};

export const useOrderAdminStore = create<OrderAdminState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchOrders: async (page = 1, limit = 10, status?: OrderStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminOrderApi.getOrders(page, limit, status);
      if (data.success) {
        set({ orders: data.data, pagination: data.pagination, isLoading: false });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
    }
  },

  getOrderById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminOrderApi.getOrderById(id);
      if (data.success) set({ selectedOrder: data.data, isLoading: false });
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminOrderApi.updateOrderStatus(id, status);
      if (data.success) {
        set({
          orders: get().orders.map((o) => (o.id === id ? data.data : o)),
          selectedOrder: data.data,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  processRefund: async (id: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminOrderApi.processRefund(id, reason);
      if (data.success) {
        set({ orders: get().orders.map((o) => (o.id === id ? data.data : o)), isLoading: false });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));
