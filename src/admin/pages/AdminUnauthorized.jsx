import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import useAuth from '@/features/auth/useAuth';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function AdminUnauthorized() {
  useDocumentTitle('Access denied');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      navigate('/admin/login', { replace: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <ShieldOff className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-600">
          You do not have permission to access the Admin Dashboard.
        </p>
        <p className="text-sm text-slate-500">
          Redirecting to login page in a few seconds...
        </p>
      </div>
    </div>
  );
}
