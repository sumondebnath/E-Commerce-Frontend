import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword } from '../services/profile.service';
import Input from '@/common/components/UI/Input';

const schema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    new_password2: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.new_password2, {
    message: 'Passwords do not match',
    path: ['new_password2'],
  });

export default function ChangePassword() {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { old_password: '', new_password: '', new_password2: '' },
  });

  const mutation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      toast.success('Password changed');
      reset();
    },
    onError: (err) => {
      const data = err?.response?.data;
      const msg = data?.detail || data?.old_password || data?.new_password || Object.values(data || {}).flat().join('. ') || 'Failed to change password';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  return (
    <section className="card-base max-w-xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Change password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Use a strong password to keep your account protected.
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
        <Input
          label="Current password"
          type="password"
          placeholder="Current password"
          error={formState.errors.old_password?.message}
          {...register('old_password')}
        />
        <Input
          label="New password"
          type="password"
          placeholder="New password"
          error={formState.errors.new_password?.message}
          {...register('new_password')}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm new password"
          error={formState.errors.new_password2?.message}
          {...register('new_password2')}
        />
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Updating...' : 'Change password'}
        </button>
      </form>
    </section>
  );
}
