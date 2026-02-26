import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface CartItem {
  productId: string;
  sizeId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/cart');
          set({ items: res.data.items, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        set({ isLoading: true });
        try {
          await api.post('/cart/add', item);
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          await api.put(`/cart/item/${itemId}`, { quantity });
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
          await api.delete(`/cart/item/${itemId}`);
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      clearLocalCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      // We persist items locally so guests have a cart, 
      // but on hydration for a logged in user, fetchCart synced with db will override it.
    }
  )
);
