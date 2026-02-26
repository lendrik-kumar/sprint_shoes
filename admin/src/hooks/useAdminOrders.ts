import { useCallback } from 'react';
import { useOrderAdminStore } from '@/stores';
import type { OrderStatus } from '@/types';

export const useAdminOrders = () => {
  const {
    orders,
    selectedOrder,
    isLoading,
    error,
    pagination,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    clearSelectedOrder,
  } = useOrderAdminStore();

  const handleFetchOrders = useCallback(
    async (page?: number, limit?: number, status?: OrderStatus) => {
      try {
        await fetchOrders(page, limit, status);
      } catch (err) {
        console.error('Fetch orders error:', err);
      }
    },
    [fetchOrders]
  );

  const handleGetOrderById = useCallback(
    async (id: string) => {
      try {
        await getOrderById(id);
      } catch (err) {
        console.error('Get order error:', err);
        throw err;
      }
    },
    [getOrderById]
  );

  const handleUpdateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      try {
        await updateOrderStatus(id, status);
      } catch (err) {
        console.error('Update order status error:', err);
        throw err;
      }
    },
    [updateOrderStatus]
  );

  return {
    orders,
    selectedOrder,
    isLoading,
    error,
    pagination,
    fetchOrders: handleFetchOrders,
    getOrderById: handleGetOrderById,
    updateOrderStatus: handleUpdateOrderStatus,
    clearSelectedOrder,
  };
};
