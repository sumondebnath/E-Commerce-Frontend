import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/api/axios';
import { ADMIN } from '@/api/endpoints';
import Input from '@/common/components/UI/Input';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

export default function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? 'Edit category' : 'Add category');

  const { data: category } = useQuery({
    queryKey: ['admin-category', id],
    queryFn: () => api.get(ADMIN.CATEGORY_DETAIL(id)).then((r) => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '' },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        slug: category.slug || '',
      });
    }
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? api.patch(ADMIN.CATEGORY_DETAIL(id), data) : api.post(ADMIN.CATEGORIES_LIST, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(isEdit ? 'Category updated' : 'Category created');
      navigate('/admin/categories');
    },
    onError: () => toast.error('Failed to save category'),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {isEdit ? 'Edit category' : 'Add category'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEdit ? 'Update the category name or slug.' : 'Create a new product category.'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="card-base max-w-2xl space-y-6 p-6">
        <Input
          label="Name"
          placeholder="Category name"
          error={formState.errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Slug"
          placeholder="category-slug"
          error={formState.errors.slug?.message}
          {...register('slug')}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Saving…' : isEdit ? 'Update category' : 'Create category'}
          </button>
          <button type="button" onClick={() => navigate('/admin/categories')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
