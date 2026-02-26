import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Proactively verify the session if we claim to be authenticated
    // Or if we haven't loaded yet
    if (!isAuthenticated || isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth, isLoading]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>; // Skeleton loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
