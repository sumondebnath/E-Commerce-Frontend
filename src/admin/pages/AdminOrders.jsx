import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import api from '@/api/axios';
import { ORDERS, ADMIN } from '@/api/endpoints';
import Table from '@/common/components/Table';
import Input from '@/common/components/UI/Input';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-rose-50 text-rose-700',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-50 text-slate-700'}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  useDocumentTitle('Orders');
  const [q, setQ] = useState({ page: 1, page_size: 20, search: '' });
  const [orderId, setOrderId] = useState('');
  const [lookupOrder, setLookupOrder] = useState(null);
  const [lookupError, setLookupError] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', q],
    queryFn: () => api.get(ADMIN.ORDERS_LIST, { params: q }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.post(ADMIN.ORDER_STATUS(id), { status }),
    onSuccess: (_data, variables) => {
      if (lookupOrder?.id === variables.id) {
        setLookupOrder((prev) => (prev ? { ...prev, order_status: variables.status } : prev));
      }
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const onPageChange = useCallback((p) => setQ((s) => ({ ...s, page: p })), []);
  const onSearch = useCallback((s) => setQ((p) => ({ ...p, search: s, page: 1 })), []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupOrder(null);
    try {
      const res = await api.get(ORDERS.DETAIL(orderId.trim()));
      setLookupOrder(res.data);
    } catch (err) {
      setLookupError(err?.response?.status === 404 ? 'Order not found.' : 'Failed to fetch order.');
    } finally {
      setLookupLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (r) => <span className="font-mono text-xs">{r.id?.slice(0, 8)}&hellip;</span>,
    },
    {
      key: 'user',
      label: 'Customer',
      render: (r) => r.user?.email || r.user || '—',
    },
    {
      key: 'total_amount',
      label: 'Total',
      render: (r) => `$${Number(r.total_amount || 0).toFixed(2)}`,
    },
    {
      key: 'item_count',
      label: 'Items',
      render: (r) => r.item_count ?? r.items?.length ?? 0,
    },
    {
      key: 'order_status',
      label: 'Status',
      render: (r) => (
        <select
          value={r.order_status || 'PENDING'}
          onChange={(e) => statusMutation.mutate({ id: r.id, status: e.target.value })}
          className={`rounded-lg border px-2 py-1 text-xs font-semibold ${STATUS_STYLES[r.order_status] || 'bg-slate-50 text-slate-700'}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <Link
          to={`/admin/orders/${r.id}`}
          className="btn-secondary inline-flex items-center gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
      ),
    },
  ];

  const rows = data?.results || [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
          <p className="mt-2 text-sm text-slate-500">
            View all orders, update statuses, or look up a specific order by ID.
          </p>
        </div>
      </header>

      <div className="card-base p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Look up order by ID</h2>
        <form onSubmit={handleLookup} className="flex max-w-md gap-3">
          <div className="flex-1">
            <Input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order UUID"
            />
          </div>
          <button type="submit" disabled={lookupLoading} className="btn-primary">
            {lookupLoading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {lookupError && (
          <p className="mt-3 text-sm text-rose-600">{lookupError}</p>
        )}

        {lookupOrder && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs text-slate-500">{lookupOrder.id}</span>
              <StatusBadge status={lookupOrder.order_status} />
              <span className="text-sm font-semibold text-slate-900">
                ${Number(lookupOrder.total_amount || 0).toFixed(2)}
              </span>
              <span className="text-sm text-slate-500">
                {lookupOrder.user?.email || lookupOrder.user || '—'}
              </span>
              <select
                value={lookupOrder.order_status || 'PENDING'}
                onChange={(e) => statusMutation.mutate({ id: lookupOrder.id, status: e.target.value })}
                className="input-base ml-auto max-w-[160px] text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Loading orders…
        </div>
      ) : (
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
      )}
    </div>
  );
}
