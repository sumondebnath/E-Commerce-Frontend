import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/api/axios';
import { PRODUCTS, ADMIN } from '@/api/endpoints';
import Table from '@/common/components/Table';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function AdminStock() {
  useDocumentTitle('Stock management');
  const [q, setQ] = useState({ page: 1, page_size: 20, search: '' });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-stock', q],
    queryFn: () => api.get(PRODUCTS.LIST, { params: q }).then((r) => r.data),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  const onPageChange = useCallback((p) => setQ((s) => ({ ...s, page: p })), []);
  const onSearch = useCallback((s) => setQ((p) => ({ ...p, search: s, page: 1 })), []);

  const qc = useQueryClient();
  const stockMutation = useMutation({
    mutationFn: ({ id, stock_count }) => api.post(ADMIN.PRODUCT_STOCK(id), { stock_count }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-stock'] });
      toast.success('Stock updated');
    },
    onError: () => toast.error('Failed to update stock'),
  });

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
    { key: 'name', label: 'Product' },
    {
      key: 'stock_count',
      label: 'Stock',
      render: (r) => {
        const stock = r.stock_count ?? 0;
        const low = stock <= 5;
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            low ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {stock}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const stock = r.stock_count ?? 0;
        if (stock === 0) return <span className="text-rose-600 font-medium">Out of stock</span>;
        if (stock <= 5) return <span className="text-amber-600 font-medium">Low stock</span>;
        return <span className="text-emerald-600 font-medium">In stock</span>;
      },
    },
    {
      key: 'actions',
      label: 'Update',
      render: (r) => (
        <div className="inline-flex items-center gap-2">
          <input
            type="number"
            min="0"
            defaultValue={r.stock_count ?? 0}
            data-stock-id={r.id}
            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                stockMutation.mutate({ id: r.id, stock_count: Number(e.target.value) });
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector(`[data-stock-id="${r.id}"]`);
              if (input) stockMutation.mutate({ id: r.id, stock_count: Number(input.value) });
            }}
            className="btn-secondary text-xs"
          >
            Save
          </button>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading stock…
      </div>
    );

  const rows = data?.results || data || [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Stock management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor inventory across your product catalog.
          </p>
        </div>
        <button type="button" onClick={() => refetch()} className="btn-secondary">
          Refresh
        </button>
      </header>

      <Table
        columns={columns}
        data={rows}
        total={data?.count || rows.length}
        page={q.page}
        pageSize={q.page_size || 20}
        onPageChange={onPageChange}
        onSearch={onSearch}
        showSearch
      />
    </div>
  );
}
