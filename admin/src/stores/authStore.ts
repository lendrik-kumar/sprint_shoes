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

// Decode JWT payload without a library
const decodeJwtPayload = (token: string): Record<string, any> => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
};

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
            const { accessToken, refreshToken } = data.data;

            // Use user from response if available, otherwise decode from JWT
            let user: User = (data.data as any).user;
            if (!user) {
              const payload = decodeJwtPayload(accessToken);
              user = {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
                firstName: null,
                lastName: null,
              } as unknown as User;
            }

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
