import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  useDocumentTitle('Order Confirmed');

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const itemCount = order.items?.length || order.item_count || 0;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Thank you — your order is confirmed</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        We have received your order and will process it shortly. Check your email for updates.
      </p>
      <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
        <p className="text-sm text-slate-600">
          Order ID: <span className="font-semibold text-slate-900">{order.id || '—'}</span>
        </p>
        <p className="text-sm text-slate-600">
          Total: <span className="font-semibold text-slate-900">${Number(order.total_amount || 0).toFixed(2)}</span>
        </p>
        <p className="text-sm text-slate-600">
          Items: <span className="font-semibold text-slate-900">{itemCount}</span>
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          Continue shopping
        </Link>
        <Link to="/profile/orders" className="btn-secondary">
          View orders
        </Link>
      </div>
    </div>
  );
}
