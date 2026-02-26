import { useCallback } from 'react';
import { useDashboardAdminStore } from '@/stores';

export const useAdminDashboard = () => {
  const { stats, isLoading, error, fetchStats } = useDashboardAdminStore();

  const handleFetchStats = useCallback(async () => {
    try {
      await fetchStats();
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    fetchStats: handleFetchStats,
  };
};
