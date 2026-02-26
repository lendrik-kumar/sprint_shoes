import { useCallback } from 'react';
import { useCartStore } from '@/stores';
import {} from '@/types';

export const useCart = () => {
  const {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    setCart,
  } = useCartStore();

  const handleFetchCart = useCallback(async () => {
    try {
      await fetchCart();
    } catch (err) {
      // Error is handled by the store
    }
  }, [fetchCart]);

  const handleAddToCart = useCallback(
    async (productId: string, variantId?: string, quantity?: number) => {
      try {
        await addToCart(productId, variantId, quantity);
      } catch (err) {
        throw err;
      }
    },
    [addToCart]
  );

  const handleUpdateCartItem = useCallback(
    async (cartItemId: string, quantity: number) => {
      try {
        await updateCartItem(cartItemId, quantity);
      } catch (err) {
        throw err;
      }
    },
    [updateCartItem]
  );

  const handleRemoveFromCart = useCallback(
    async (cartItemId: string) => {
      try {
        await removeFromCart(cartItemId);
      } catch (err) {
        throw err;
      }
    },
    [removeFromCart]
  );

  const handleClearCart = useCallback(async () => {
    try {
      await clearCart();
    } catch (err) {
      throw err;
    }
  }, [clearCart]);

  const itemCount = cart?.items?.length || 0;
  const total = cart?.total || 0;
  const subtotal = cart?.subtotal || 0;
  const tax = cart?.tax || 0;
  const shipping = cart?.shipping || 0;

  return {
    cart,
    itemCount,
    total,
    subtotal,
    tax,
    shipping,
    isLoading,
    error,
    fetchCart: handleFetchCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    clearError,
    setCart,
  };
};
