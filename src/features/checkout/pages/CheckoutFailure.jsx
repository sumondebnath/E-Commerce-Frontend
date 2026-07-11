import { Link, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function CheckoutFailure() {
  const location = useLocation();
  const errorMessage = location.state?.error;
  useDocumentTitle('Checkout Failed');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
        <AlertCircle className="h-10 w-10 text-rose-600" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        {errorMessage || "We couldn't process your order. Please check your information and try again."}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/checkout" className="btn-primary">
          Try again
        </Link>
        <Link to="/cart" className="btn-secondary">
          Back to cart
        </Link>
      </div>
    </div>
  );
}
