import { useCallback } from 'react';
import { useOrderStore } from '@/stores';

export const useOrder = () => {
  const {
    orders,
    selectedOrder,
    isLoading,
    isFetching,
    error,
    pagination,
    fetchOrders,
    getOrderById,
    createOrder,
    cancelOrder,
    clearError,
    setSelectedOrder,
  } = useOrderStore();

  const handleFetchOrders = useCallback(
    async (page?: number, limit?: number) => {
      try {
        await fetchOrders(page, limit);
      } catch (err) {
        // Error is handled by the store
      }
    },
    [fetchOrders]
  );

  const handleGetOrderById = useCallback(
    async (id: string) => {
      try {
        await getOrderById(id);
      } catch (err) {
        throw err;
      }
    },
    [getOrderById]
  );

  const handleCreateOrder = useCallback(
    async (orderData: any) => {
      try {
        const order = await createOrder(orderData);
        return order;
      } catch (err) {
        throw err;
      }
    },
    [createOrder]
  );

  const handleCancelOrder = useCallback(
    async (id: string) => {
      try {
        await cancelOrder(id);
      } catch (err) {
        throw err;
      }
    },
    [cancelOrder]
  );

  return {
    orders,
    selectedOrder,
    isLoading,
    isFetching,
    error,
    pagination,
    fetchOrders: handleFetchOrders,
    getOrderById: handleGetOrderById,
    createOrder: handleCreateOrder,
    cancelOrder: handleCancelOrder,
    clearError,
    setSelectedOrder,
  };
};
