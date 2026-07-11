import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAddresses from '@/features/checkout/hooks/useAddresses';
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from '@/features/checkout/services/addresses.service';
import ConfirmDialog from '@/common/components/ConfirmDialog';
import Input from '@/common/components/UI/Input';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const schema = z.object({
  address_type: z.enum(['billing', 'shipping']),
  street_address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  is_default: z.boolean().optional(),
});

export default function AddressesPage() {
  useDocumentTitle('Addresses');
  const q = useAddresses();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address_type: 'shipping',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Bangladesh',
      is_default: false,
    },
  });

  const startAdd = () => {
    setEditing('new');
    reset({
      address_type: 'shipping',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Bangladesh',
      is_default: false,
    });
  };
  const startEdit = (a) => {
    setEditing(a.id);
    reset(a);
  };

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editing === 'new' ? createAddress(data) : updateAddress(editing, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(editing === 'new' ? 'Address added' : 'Address updated');
      setEditing(null);
    },
    onError: () => toast.error('Failed to save address'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete address'),
  });

  return (
    <div className="space-y-6">
      <section className="card-base p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Addresses</h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your saved delivery addresses for faster checkout.
            </p>
          </div>
          <button type="button" onClick={startAdd} className="btn-primary">
            Add address
          </button>
        </div>
      </section>

      <div className="grid gap-4">
        {(q.data || []).map((a) => (
          <div key={a.id} className="card-base p-5 sm:flex sm:justify-between sm:items-center">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                {a.address_type === 'billing' ? 'Billing' : 'Shipping'}
                {a.is_default && <span className="ml-2 text-xs text-amber-600">(Default)</span>}
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {a.street_address}, {a.city}, {a.state}, {a.postal_code}, {a.country}
              </p>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              <button type="button" onClick={() => startEdit(a)} className="btn-secondary">
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(a)}
                className="inline-flex items-center justify-center rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <section className="card-base p-6">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            {editing === 'new' ? 'Add address' : 'Edit address'}
          </h2>
          <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="max-w-2xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Address type</label>
              <select {...register('address_type')} className="input-base mt-2">
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            <Input
              label="Street address"
              placeholder="Street address, apartment, suite, etc."
              error={formState.errors.street_address?.message}
              {...register('street_address')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                placeholder="City"
                error={formState.errors.city?.message}
                {...register('city')}
              />
              <Input
                label="State"
                placeholder="State"
                error={formState.errors.state?.message}
                {...register('state')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Postal code"
                placeholder="Postal code"
                error={formState.errors.postal_code?.message}
                {...register('postal_code')}
              />
              <Input
                label="Country"
                placeholder="Country"
                error={formState.errors.country?.message}
                {...register('country')}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('is_default')}
                id="is-default"
                className="h-4 w-4 rounded border-slate-300 text-amber-600"
              />
              <label htmlFor="is-default" className="text-sm text-slate-700">Set as default address</label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving…' : 'Save address'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete address"
        message={`Delete this address?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        confirmLabel="Delete"
      />
    </div>
  );
}
