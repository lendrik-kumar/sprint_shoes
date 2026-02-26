import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileDTO } from '@ecommerce/shared';
import { api } from '../lib/api';

interface AuthState {
  user: UserProfileDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', credentials);
          set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Listen to global 401 events thrown by our Axios interceptor
window.addEventListener('auth:unauthorized', () => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
