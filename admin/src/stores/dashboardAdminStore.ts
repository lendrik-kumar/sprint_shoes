import { create } from 'zustand';
import type { ApiError } from '@/types';
import { adminDashboardApi } from '@/api';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
  salesByCategory: Array<{ category: string; sales: number }>;
  revenueOverTime: Array<{ date: string; revenue: number }>;
}

interface DashboardAdminState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: ApiError | null;

  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardAdminStore = create<DashboardAdminState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminDashboardApi.getStats();
      if (data.success) set({ stats: data.data, isLoading: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; code?: string } } };
      set({
        error: {
          success: false,
          message: e?.response?.data?.message ?? 'Failed to fetch dashboard stats',
          code: e?.response?.data?.code,
        },
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
