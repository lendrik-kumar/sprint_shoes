import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ApiError } from '@/types';
import { authApi } from '@/api';

interface AdminAuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;

  init: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      init: () => {
        const { accessToken, user } = get();
        if (accessToken && user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
          set({ isAuthenticated: true });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.login(email, password);
          if (data.success) {
            const { user, accessToken, refreshToken } = data.data;
            if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
              set({
                error: { success: false, message: 'Access denied. Admin privileges required.' },
                isLoading: false,
              });
              return;
            }
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
          }
        } catch (err: unknown) {
          const e = err as { response?: { data?: { message?: string; code?: string } } };
          set({
            error: {
              success: false,
              message: e?.response?.data?.message ?? 'Login failed',
              code: e?.response?.data?.code,
            },
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
