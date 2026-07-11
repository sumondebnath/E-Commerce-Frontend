import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/useAuth';
import getUserRoles from '@/common/auth/getUserRoles';
import { toast } from 'sonner';
import Input from '@/common/components/UI/Input';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

export default function AdminLoginForm() {
  const { login, authLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setError } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;
    const roles = getUserRoles(user);
    if (roles.includes('admin')) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (values) => {
    const res = await login(values, true);
    if (!res.success) {
      const message = res.error?.response?.data?.detail || res.error?.message || 'Login failed';
      toast.error(message);
      if (res.error?.response?.data) {
        const data = res.error.response.data;
        Object.entries(data).forEach(([k, v]) => {
          if (k in { email: '', password: '' }) setError(k, { type: 'server', message: v });
        });
      }
    } else {
      const roles = getUserRoles(res.user || {});
      if (!roles.includes('admin')) {
        toast.error('You do not have admin access');
        await logout();
        return;
      }
      toast.success('Welcome to Admin Dashboard');
      navigate('/admin', { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <Shield className="h-5 w-5 text-amber-600" />
        <p className="text-sm text-slate-600">Admin access only. Unauthorized users will be rejected.</p>
      </div>

      <Input
        id="admin-email"
        label="Email"
        type="email"
        placeholder="admin@example.com"
        autoComplete="email"
        {...register('email')}
      />
      <Input
        id="admin-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword((s) => !s)}
        placeholder="Enter your password"
        autoComplete="current-password"
        {...register('password')}
      />

      <div>
        <button type="submit" className="btn-primary w-full" disabled={authLoading}>
          {authLoading ? 'Signing in\u2026' : 'Sign in to Admin'}
        </button>
      </div>
    </form>
  );
}
