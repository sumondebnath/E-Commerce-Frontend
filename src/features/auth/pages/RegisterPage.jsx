import AuthLayout from '@/common/layout/AuthLayout';
import RegisterForm from '../components/RegisterForm';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Create account');
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create an account to save your favorites, checkout faster, and view order history.
          </p>
        </div>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
}
