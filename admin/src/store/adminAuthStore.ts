import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileDTO } from '@ecommerce/shared';
import { api } from '../lib/api';

interface AdminAuthState {
  admin: UserProfileDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/admin/login', credentials);
          set({ admin: res.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          set({ admin: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/auth/me'); // Admin profile is still on auth/me
          // Double check role
          if (res.data.role !== 'ADMIN' && res.data.role !== 'SUPERADMIN') {
            throw new Error('Unauthorized role');
          }
          set({ admin: res.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ admin: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ admin: state.admin, isAuthenticated: state.isAuthenticated }),
    }
  )
);

window.addEventListener('admin:unauthorized', () => {
  useAdminAuthStore.setState({ admin: null, isAuthenticated: false });
});
