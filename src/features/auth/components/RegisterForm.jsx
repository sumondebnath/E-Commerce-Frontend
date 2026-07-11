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
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
  password2: z.string().min(6, 'Confirm password'),
  remember: z.boolean().optional(),
}).refine((d) => d.password === d.password2, {
  message: 'Passwords do not match',
  path: ['password2'],
});

export default function RegisterForm() {
  const { register: formRegister, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { remember: false },
  });
  const { register: registerAction, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const onSubmit = async (values) => {
    const { remember, ...payload } = values;
    const res = await registerAction(payload, remember);
    if (!res.success) {
      const data = res.error?.response?.data;
      const msg = typeof data === 'string' ? data : data?.detail || Object.values(data || {}).flat().join('. ') || res.error?.message || 'Registration failed';
      toast.error(msg);
      if (data && typeof data === 'object' && !data.detail) {
        const validFields = ['first_name', 'last_name', 'email', 'password', 'password2'];
        Object.entries(data).forEach(([k, v]) => {
          const field = k === 'password' ? 'password' : k;
          if (validFields.includes(field)) {
            setError(field, { type: 'server', message: Array.isArray(v) ? v[0] : v });
          }
        });
      }
    } else {
      toast.success('Account created successfully');
      const roles = getUserRoles(res.user || {});
      const redirectTo = location.state?.from || (roles.includes('admin') ? '/admin' : '/');
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="reg-first-name"
          label="First Name"
          placeholder="John"
          autoComplete="given-name"
          error={formState.errors.first_name?.message}
          {...formRegister('first_name')}
        />
        <Input
          id="reg-last-name"
          label="Last Name"
          placeholder="Doe"
          autoComplete="family-name"
          error={formState.errors.last_name?.message}
          {...formRegister('last_name')}
        />
      </div>
      <Input
        id="reg-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={formState.errors.email?.message}
        {...formRegister('email')}
      />
      <Input
        id="reg-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword((s) => !s)}
        placeholder="Create a password"
        autoComplete="new-password"
        error={formState.errors.password?.message}
        {...formRegister('password')}
      />
      <Input
        id="reg-password2"
        label="Confirm Password"
        type={showPassword2 ? 'text' : 'password'}
        rightIcon={showPassword2 ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword2((s) => !s)}
        placeholder="Repeat password"
        autoComplete="new-password"
        error={formState.errors.password2?.message}
        {...formRegister('password2')}
      />
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          {...formRegister('remember')}
          id="reg-remember"
          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="reg-remember">Remember me</label>
      </div>
      <div>
        <button type="submit" className="btn-primary w-full" disabled={authLoading}>
          {authLoading ? 'Creating account\u2026' : 'Create account'}
        </button>
      </div>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-amber-600 hover:text-amber-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
