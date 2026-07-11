import AuthLayout from '@/common/layout/AuthLayout';
import LoginForm from '../components/LoginForm';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Sign in');
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue shopping and manage your orders, wishlist, and profile.
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
