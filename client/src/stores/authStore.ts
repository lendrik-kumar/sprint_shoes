import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ApiError } from '@/types';
import { authApi } from '@/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;

  init: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
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
        if (accessToken && user) {
          set({ isAuthenticated: true });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.login(email, password);
          if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
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

      register: async (email, password, firstName, lastName) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.register(email, password, firstName, lastName);
          if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err: unknown) {
          const e = err as { response?: { data?: { message?: string; code?: string } } };
          set({
            error: {
              success: false,
              message: e?.response?.data?.message ?? 'Registration failed',
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
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
