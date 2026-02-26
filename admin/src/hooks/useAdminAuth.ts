import { useCallback } from 'react';
import { useAdminAuthStore } from '@/stores';

export const useAdminAuth = () => {
  const { user, accessToken, isLoading, error, login, logout, clearError, init } =
    useAdminAuthStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);
      } catch (err) {
        console.error('Admin login error:', err);
        throw err;
      }
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleInit = useCallback(() => {
    init();
  }, [init]);

  const isAuthenticated = !!user && !!accessToken;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError,
    init: handleInit,
  };
};
