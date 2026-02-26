import { create } from 'zustand';
import type { ApiError } from '@/types';
import { adminAuditApi } from '@/api';

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

type Pagination = { page: number; limit: number; total: number; pages: number };

interface AuditFilters {
  search?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

interface AuditAdminState {
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;
  filters: AuditFilters;

  fetchAuditLogs: (page?: number, limit?: number, filters?: AuditFilters) => Promise<void>;
  setFilters: (filters: AuditFilters) => void;
  clearError: () => void;
}

export const useAuditAdminStore = create<AuditAdminState>((set) => ({
  auditLogs: [],
  isLoading: false,
  error: null,
  pagination: null,
  filters: {},

  fetchAuditLogs: async (page = 1, limit = 20, filters?: AuditFilters) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminAuditApi.getAuditLogs(page, limit, filters);
      if (data.success) {
        set({ auditLogs: data.data, pagination: data.pagination, isLoading: false });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; code?: string } } };
      set({
        error: {
          success: false,
          message: e?.response?.data?.message ?? 'Failed to fetch audit logs',
          code: e?.response?.data?.code,
        },
        isLoading: false,
      });
    }
  },

  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));
