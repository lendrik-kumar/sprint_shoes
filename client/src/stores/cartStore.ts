import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, ApiError } from '@/types';
import { cartApi } from '@/api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: ApiError | null;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
  setCart: (cart: Cart) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await cartApi.getCart();
          if (data.success) {
            set({ cart: data.data, isLoading: false });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to fetch cart',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
        }
      },

      addToCart: async (productId: string, variantId?: string, quantity: number = 1) => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await cartApi.addToCart(productId as any, variantId as any, quantity as any);
          if (data.success) {
            set({ cart: data.data, isLoading: false });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to add to cart',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      updateCartItem: async (cartItemId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await cartApi.updateCartItem(cartItemId, quantity);
          if (data.success) {
            set({ cart: data.data, isLoading: false });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to update cart item',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      removeFromCart: async (cartItemId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await cartApi.removeFromCart(cartItemId);
          if (data.success) {
            set({ cart: data.data, isLoading: false });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to remove item from cart',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data }: any = await cartApi.clearCart();
          if (data.success) {
            set({ cart: null, isLoading: false });
          }
        } catch (err: any) {
          set({
            error: {
              success: false,
              message: err?.response?.data?.message || 'Failed to clear cart',
              code: err?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
      setCart: (cart: Cart) => set({ cart }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);
