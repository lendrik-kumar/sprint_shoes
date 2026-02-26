import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, ApiError, OrderStatus } from '@/types';
import { orderApi } from '@/api';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;

  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  getOrderById: (id: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<Order>;
  cancelOrder: (id: string) => Promise<void>;
  clearError: () => void;
  setSelectedOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrder: null,
      isLoading: false,
      isFetching: false,
      error: null,
      pagination: null,

      fetchOrders: async (page: number = 1, limit: number = 10) => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await orderApi.getOrders(page, limit);
          if (data.success) {
            set({
              orders: data.data,
              pagination: {
                page: data.pagination.page,
                limit: data.pagination.limit,
                total: data.pagination.total,
                pages: data.pagination.pages,
              },
              isLoading: false,
            });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to fetch orders',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
        }
      },

      getOrderById: async (id: string) => {
        set({ isFetching: true, error: null });
        try {
          const { data }: any = await orderApi.getOrderById(id);
          if (data.success) {
            set({
              selectedOrder: data.data,
              isFetching: false,
            });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to fetch order',
              code: err?.response?.data?.code,
            },
            isFetching: false,
          });
          throw err;
        }
      },

      createOrder: async (orderData: any) => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await orderApi.createOrder(orderData);
          if (data.success) {
            const newOrder = data.data;
            set({
              orders: [newOrder, ...get().orders],
              selectedOrder: newOrder,
              isLoading: false,
            });
            return newOrder;
          }
          throw new Error('Failed to create order');
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to create order',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      cancelOrder: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await orderApi.cancelOrder(id);
          if (data.success) {
            // Update order in list with status CANCELLED
            const updatedOrders = get().orders.map((order) =>
              order.id === id ? { ...order, status: 'CANCELLED' as OrderStatus } : order
            );
            set({
              orders: updatedOrders,
              selectedOrder:
                get().selectedOrder?.id === id
                  ? { ...get().selectedOrder!, status: 'CANCELLED' as OrderStatus }
                  : get().selectedOrder,
              isLoading: false,
            });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to cancel order',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
      setSelectedOrder: (order: Order | null) => set({ selectedOrder: order }),
    }),
    {
      name: 'order-store',
      partialize: (state) => ({
        orders: state.orders,
        selectedOrder: state.selectedOrder,
      }),
    }
  )
);
