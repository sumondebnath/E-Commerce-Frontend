import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Package } from 'lucide-react';
import api from '@/api/axios';
import { ORDERS, ADMIN } from '@/api/endpoints';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-rose-50 text-rose-700',
};

export default function AdminOrderDetail() {
  useDocumentTitle('Order detail');
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => api.get(ORDERS.DETAIL(id)).then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: (status) => api.post(ADMIN.ORDER_STATUS(id), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading order details...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="font-medium text-rose-700">Order not found.</p>
        <button onClick={() => navigate('/admin/orders')} className="btn-primary mt-4">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Order Details</h1>
            <p className="mt-1 font-mono text-sm text-slate-500">{order.id}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-base p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Customer</h2>
          <p className="text-sm text-slate-900">{order.user?.email || order.user || '—'}</p>
          <p className="mt-1 text-sm text-slate-500">
            {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
          </p>
        </div>

        <div className="card-base p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Status</h2>
          <div className="flex items-center gap-3">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.order_status] || 'bg-slate-50 text-slate-700'}`}>
              {order.order_status}
            </span>
          </div>
          <select
            value={order.order_status || 'PENDING'}
            onChange={(e) => statusMutation.mutate(e.target.value)}
            className="input-base mt-3"
            disabled={statusMutation.isPending}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="card-base p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Total</h2>
          <p className="text-3xl font-bold text-slate-900">
            ${Number(order.total_amount || 0).toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {order.item_count ?? order.items?.length ?? 0} item(s)
          </p>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="card-base p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Items</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200">
                  <Package className="h-6 w-6 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.product_name || item.name || `Product ${item.product}`}
                  </p>
                  <p className="text-sm text-slate-500">
                    ${Number(item.price || item.product_price || 0).toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ${Number(item.subtotal || (item.price || 0) * item.quantity || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
