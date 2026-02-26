import { create } from 'zustand';
import type { User, UserRole, ApiError } from '@/types';
import { adminUserApi } from '@/api';

type Pagination = { page: number; limit: number; total: number; pages: number };

interface UserAdminState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;

  fetchUsers: (page?: number, limit?: number, search?: string) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  updateUserRole: (id: string, role: UserRole) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearSelectedUser: () => void;
  clearError: () => void;
}

const handleError = (err: unknown): ApiError => {
  const e = err as { response?: { data?: { message?: string; code?: string } } };
  return {
    success: false,
    message: e?.response?.data?.message ?? 'An error occurred',
    code: e?.response?.data?.code,
  };
};

export const useUserAdminStore = create<UserAdminState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchUsers: async (page = 1, limit = 10, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminUserApi.getUsers(page, limit, search);
      if (data.success) {
        set({ users: data.data, pagination: data.pagination, isLoading: false });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
    }
  },

  getUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminUserApi.getUserById(id);
      if (data.success) set({ selectedUser: data.data, isLoading: false });
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminUserApi.updateUser(id, userData);
      if (data.success) {
        set({
          users: get().users.map((u) => (u.id === id ? data.data : u)),
          selectedUser: data.data,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  updateUserRole: async (id: string, role: UserRole) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminUserApi.updateUser(id, { role });
      if (data.success) {
        set({
          users: get().users.map((u) => (u.id === id ? data.data : u)),
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  toggleUserStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = get().users.find((u) => u.id === id);
      const { data } = await adminUserApi.updateUser(id, { isActive: !user?.isActive });
      if (data.success) {
        set({
          users: get().users.map((u) => (u.id === id ? data.data : u)),
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminUserApi.deleteUser(id);
      if (data.success) {
        set({
          users: get().users.filter((u) => u.id !== id),
          selectedUser: get().selectedUser?.id === id ? null : get().selectedUser,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),
  clearError: () => set({ error: null }),
}));
