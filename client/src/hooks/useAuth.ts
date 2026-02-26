import { useCallback } from 'react';
import { useAuthStore } from '@/stores';
import {} from '@/types';

export const useAuth = () => {
  const { user, accessToken, isLoading, error, login, register, logout, clearError, setUser } =
    useAuthStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);
      } catch (err) {
        throw err;
      }
    },
    [login]
  );

  const handleRegister = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        await register(email, password, firstName, lastName);
      } catch (err) {
        throw err;
      }
    },
    [register]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const isAuthenticated = !!user && !!accessToken;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
    setUser,
  };
};
