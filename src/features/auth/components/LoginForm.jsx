import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import useAuth from '../useAuth';
import getUserRoles from '@/common/auth/getUserRoles';
import { toast } from 'sonner';
import Input from '@/common/components/UI/Input';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
  remember: z.boolean().optional(),
});

export default function LoginForm() {
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = async (values) => {
    const { remember, ...creds } = values;
    const res = await login(creds, remember);
    if (!res.success) {
      const data = res.error?.response?.data;
      const message = data?.detail || res.error?.message || 'Login failed';
      toast.error(message);
      if (data && typeof data === 'object') {
        const validFields = ['email', 'password'];
        Object.entries(data).forEach(([k, v]) => {
          if (validFields.includes(k)) {
            setError(k, { type: 'server', message: Array.isArray(v) ? v[0] : v });
          }
        });
      }
    } else {
      toast.success('Logged in successfully');
      const roles = getUserRoles(res.user || {});
      const redirectTo = location.state?.from || (roles.includes('admin') ? '/admin' : '/');
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={formState.errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword((s) => !s)}
        placeholder="Enter your password"
        autoComplete="current-password"
        error={formState.errors.password?.message}
        {...register('password')}
      />
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          {...register('remember')}
          id="remember"
          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="remember">Remember me</label>
      </div>
      <div>
        <button type="submit" className="btn-primary w-full" disabled={authLoading}>
          {authLoading ? 'Signing in\u2026' : 'Sign in'}
        </button>
      </div>
      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-amber-600 hover:text-amber-700">
          Create one
        </Link>
      </p>
    </form>
  );
}
