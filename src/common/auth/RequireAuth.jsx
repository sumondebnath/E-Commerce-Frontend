import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '@/features/auth/useAuth';

export default function RequireAuth({ redirectTo = '/auth/login' }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600" />
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
  );
}
