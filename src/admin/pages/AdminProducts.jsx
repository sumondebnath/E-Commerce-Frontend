import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import { ADMIN } from '@/api/endpoints';
import Table from '@/common/components/Table';
import ConfirmDialog from '@/common/components/ConfirmDialog';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function AdminProducts() {
  useDocumentTitle('Products');
  const [q, setQ] = useState({ page: 1, page_size: 20, search: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', q],
    queryFn: () => api.get(ADMIN.PRODUCTS, { params: q }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(ADMIN.PRODUCT_DETAIL(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
      setDeleteTarget(null);
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to delete product';
      toast.error(msg);
    },
  });

  const onPageChange = useCallback((p) => setQ((s) => ({ ...s, page: p })), []);
  const onSearch = useCallback((s) => setQ((p) => ({ ...p, search: s, page: 1 })), []);

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'image_url',
      label: 'Image',
      render: (r) =>
        r.image_url ? (
          <img src={r.image_url} alt={r.name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <span className="text-slate-400 text-xs">No image</span>
        ),
    },
    { key: 'name', label: 'Name' },
    {
      key: 'price',
      label: 'Price',
      render: (r) => (typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : r.price || '-'),
    },
    { key: 'stock_count', label: 'Stock' },
    {
      key: 'is_active',
      label: 'Status',
      render: (r) =>
        r.is_active ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Draft
          </span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="inline-flex flex-wrap items-center gap-2">
          <Link to={`/admin/products/${r.id}/edit`} className="btn-secondary">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(r)}
            className="btn-secondary text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const rows = data?.results || [];

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading products…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your product catalog — add, edit, and remove products.
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </header>

      <Table
        columns={columns}
        data={rows}
        total={data?.count || 0}
        page={q.page}
        pageSize={q.page_size || 20}
        onPageChange={onPageChange}
        onSearch={onSearch}
        showSearch
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
