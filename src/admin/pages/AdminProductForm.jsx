import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import api from '@/api/axios';
import { PRODUCTS, CATEGORIES } from '@/api/endpoints';
import Input from '@/common/components/UI/Input';
import Textarea from '@/common/components/UI/Textarea';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  stock_count: z.coerce.number().int().nonnegative('Stock must be 0 or more'),
  category_id: z.coerce.number().optional(),
  is_active: z.boolean(),
  image: z
    .custom()
    .optional()
    .refine(
      (file) => !file || file instanceof File,
      'Must be a file'
    )
    .refine(
      (file) => !file || ACCEPTED_TYPES.includes(file.type),
      'Accepted types: JPEG, PNG, WebP, GIF'
    )
    .refine(
      (file) => !file || file.size <= MAX_SIZE,
      'Maximum file size is 5 MB'
    ),
});

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? 'Edit product' : 'Add product');
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const { data: product } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => api.get(PRODUCTS.DETAIL(id)).then((r) => r.data),
    enabled: isEdit,
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: () => api.get(CATEGORIES.LIST).then((r) => r.data),
  });

  const { register, handleSubmit, formState, reset, setValue, watch, setError, clearErrors } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock_count: 0,
      category_id: undefined,
      is_active: true,
      image: undefined,
    },
  });

  const watchedImage = watch('image');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: Number(product.price) || 0,
        stock_count: product.stock_count ?? 0,
        category_id: product.category?.id || product.category_id || undefined,
        is_active: product.is_active ?? true,
        image: undefined,
      });
      setExistingImageUrl(product.image_url || null);
      setPreview(null);
    }
  }, [product, reset]);

  useEffect(() => {
    if (watchedImage instanceof File) {
      const url = URL.createObjectURL(watchedImage);
      setPreview(url);
      clearErrors('image');
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [watchedImage, clearErrors]);

  const handleFileChange = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('image', { message: 'Accepted types: JPEG, PNG, WebP, GIF' });
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('image', { message: 'Maximum file size is 5 MB' });
        return;
      }
      clearErrors('image');
      setValue('image', file, { shouldValidate: true });
    },
    [setError, clearErrors, setValue]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setValue('image', undefined, { shouldValidate: true });
    setExistingImageUrl(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const mutation = useMutation({
    mutationFn: (formData) =>
      isEdit ? api.patch(PRODUCTS.DETAIL(id), formData) : api.post(PRODUCTS.LIST, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stock'] });
      toast.success(isEdit ? 'Product updated' : 'Product created');
      navigate('/admin/products');
    },
    onError: () => toast.error('Failed to save product'),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', String(data.price));
    formData.append('stock_count', String(data.stock_count));
    if (data.category_id) formData.append('category_id', String(data.category_id));
    formData.append('is_active', String(data.is_active));
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    mutation.mutate(formData);
  };

  const categoryList = Array.isArray(categories) ? categories : (categories?.results || []);

  const displayImage = preview || existingImageUrl;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {isEdit ? 'Edit product' : 'Add product'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEdit ? 'Update product details and inventory.' : 'Create a new product in your catalog.'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="card-base max-w-2xl space-y-6 p-6">
        <Input
          label="Name"
          placeholder="Product name"
          error={formState.errors.name?.message}
          {...register('name')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={formState.errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            error={formState.errors.stock_count?.message}
            {...register('stock_count')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select {...register('category_id')} className="input-base mt-2">
            <option value="">No category</option>
            {categoryList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="Description"
          rows={4}
          placeholder="Product description"
          error={formState.errors.description?.message}
          {...register('description')}
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register('is_active')}
            id="is_active"
            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
            Active (visible on store)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Image</label>
          <div
            className="mt-2"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {displayImage ? (
              <div className="relative inline-block">
                <img
                  src={displayImage}
                  alt="Product preview"
                  className="h-48 w-48 rounded-xl object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 rounded-full bg-rose-500 p-1 text-white shadow-sm hover:bg-rose-600 transition"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-amber-400 hover:bg-amber-50/30"
              >
                <Upload className="h-8 w-8 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    JPEG, PNG, WebP, GIF — max 5 MB
                  </p>
                </div>
              </label>
            )}
            <input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </div>
          {formState.errors.image && (
            <p className="mt-1 text-sm text-rose-600">{formState.errors.image.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
