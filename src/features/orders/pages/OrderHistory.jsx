import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';
import { PageHeaderSkeleton } from '@/common/components/UI/Skeleton';

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-rose-50 text-rose-700',
};

export default function OrderHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useOrders({ page, page_size: 10 });
  useDocumentTitle('Order History');

  if (isLoading) return <PageHeaderSkeleton />;

  if (isError) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="font-medium text-rose-700">Error loading orders.</p>
      </div>
    );
  }

  const orders = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / 10));

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-slate-500" />
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Order history</h1>
              <p className="mt-1 text-sm text-slate-500">
                {count} order{count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link to="/products" className="btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-900">No orders yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Place your first order to see it here.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-block">
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {orders.map((order) => (
              <article key={order.id} className="card-base p-6 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Order #{String(order.id).slice(0, 8)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                          STATUS_STYLES[order.order_status] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {order.order_status || 'Unknown'}
                      </span>
                      <span className="text-sm text-slate-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        ${Number(order.total_amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/profile/orders/${order.id}`}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-600">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
