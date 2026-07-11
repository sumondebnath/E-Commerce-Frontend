import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAuth from '@/features/auth/useAuth';
import { updateProfile } from '../services/profile.service';
import Input from '@/common/components/UI/Input';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

export default function EditProfile() {
  useDocumentTitle('Edit profile');
  const { user, setUser } = useAuth();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (data) => {
      setUser(data);
      toast.success('Profile updated');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  return (
    <section className="card-base p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Edit profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update your name and email address for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={formState.errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={formState.errors.last_name?.message}
            {...register('last_name')}
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </button>
          <p className="text-sm text-slate-500">Changes will be reflected in your next login.</p>
        </div>
      </form>
    </section>
  );
}
