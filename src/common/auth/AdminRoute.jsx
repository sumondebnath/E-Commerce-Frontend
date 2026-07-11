import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/features/auth/useAuth';
import getUserRoles from './getUserRoles';

export default function AdminRoute({ redirectTo = '/admin/login' }) {
  const { loading, user, logout } = useAuth();
  const [countdown, setCountdown] = useState(null);

  const roles = getUserRoles(user);
  const isAdmin = roles.includes('admin');

  useEffect(() => {
    if (isAdmin || countdown === null) return;
    if (countdown <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isAdmin, countdown, logout]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600" />
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;

  if (!isAdmin && countdown === null) {
    setCountdown(4);
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-600">
            You do not have permission to access the Admin Dashboard.
          </p>
          <p className="text-sm text-slate-500">
            Redirecting in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
