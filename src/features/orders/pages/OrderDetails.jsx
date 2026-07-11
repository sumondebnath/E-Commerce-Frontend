import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useOrder, useCancelOrder } from '../hooks/useOrders';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';
import { PageHeaderSkeleton } from '@/common/components/UI/Skeleton';
import ConfirmDialog from '@/common/components/ConfirmDialog';

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-rose-50 text-rose-700',
};

const TIMELINE = [
  { status: 'PENDING', label: 'Placed', desc: 'Order has been placed' },
  { status: 'PROCESSING', label: 'Processing', desc: 'Order is being prepared' },
  { status: 'SHIPPED', label: 'Shipped', desc: 'Order has been shipped' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Order has been delivered' },
];

const canCancel = (status) => status === 'PENDING' || status === 'PROCESSING';

export default function OrderDetails() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrder(id);
  const cancel = useCancelOrder();
  const [showCancel, setShowCancel] = useState(false);
  useDocumentTitle(order ? `Order #${String(order.id).slice(0, 8)}` : 'Order');

  const handleCancel = () => {
    cancel.mutate(id, {
      onSuccess: () => {
        toast.success('Order cancelled');
        setShowCancel(false);
      },
      onError: () => toast.error('Failed to cancel order'),
    });
  };

  if (isLoading) return <PageHeaderSkeleton />;

  if (isError || !order) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="font-medium text-rose-700">Error loading order.</p>
        <Link to="/profile/orders" className="btn-primary mt-4 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  const shippingAddress = [
    order.shipping_full_name,
    order.shipping_street_address,
    order.shipping_city,
    order.shipping_state,
    order.shipping_postal_code,
    order.shipping_country,
  ].filter(Boolean).join(', ');

  const currentIdx = TIMELINE.findIndex((t) => t.status === order.order_status);
  const isCancelled = order.order_status === 'CANCELLED';

  return (
    <section className="space-y-6">
      <Link
        to="/profile/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Order #{String(order.id).slice(0, 8)}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              STATUS_STYLES[order.order_status] || 'bg-slate-100 text-slate-600'
            }`}
          >
            {order.order_status || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="card-base p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Status</h2>
        {isCancelled ? (
          <div className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            This order has been cancelled.
          </div>
        ) : (
          <ol className="mt-6">
            {TIMELINE.map((step, idx) => {
              const done = idx <= currentIdx;
              const isLast = idx === TIMELINE.length - 1;
              return (
                <li key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                  {!isLast && (
                    <div
                      className={`absolute left-[11px] top-5 w-0.5 -translate-x-1/2 ${
                        done ? 'bg-amber-500' : 'bg-slate-200'
                      }`}
                      style={{ height: 'calc(100% - 8px)' }}
                    />
                  )}
                  <div
                    className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className={`font-semibold ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-sm ${done ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_0.9fr]">
        <div className="card-base p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Items</h2>
          <ul className="mt-4 space-y-3">
            {(order.items || []).map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {item.product_name_snapshot || item.product_name || item.product}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.quantity} &times; ${item.price_at_purchase}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ${Number(item.line_total || 0).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="card-base p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${Number(order.subtotal_cost || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  ${Number(order.shipping_cost || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">Total</span>
                  <span className="font-bold text-slate-900">
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {canCancel(order.order_status) && (
              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className="btn-secondary mt-6 inline-flex w-full items-center justify-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Cancel order
              </button>
            )}
          </div>

          <div className="card-base p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Shipping to</h2>
            <p className="mt-2 text-sm text-slate-600">{shippingAddress || '—'}</p>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={showCancel}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
        title="Cancel order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel={cancel.isPending ? 'Cancelling\u2026' : 'Yes, cancel order'}
        variant="danger"
      />
    </section>
  );
}
