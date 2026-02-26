import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { useEffect } from 'react';
import { UserRole } from '@ecommerce/shared';

interface AdminRouteProps {
  allowedRoles?: UserRole[];
}

export const AdminRoute = ({ allowedRoles = [UserRole.ADMIN, UserRole.SUPERADMIN] }: AdminRouteProps) => {
  const { isAuthenticated, admin, isLoading, checkAuth } = useAdminAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Admin...</div>;
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(admin.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
