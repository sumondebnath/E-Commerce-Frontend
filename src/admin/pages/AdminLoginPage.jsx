import AuthLayout from '@/common/layout/AuthLayout';
import AdminLoginForm from '../components/AdminLoginForm';
import { Shield } from 'lucide-react';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function AdminLoginPage() {
  useDocumentTitle('Admin sign in');
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <Shield className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
            <p className="text-sm text-slate-500">Sign in to manage your store</p>
          </div>
        </div>
        <AdminLoginForm />
      </div>
    </AuthLayout>
  );
}
