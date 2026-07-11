import { Link } from 'react-router-dom';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-bold text-amber-600">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          Go home
        </Link>
        <Link to="/products" className="btn-secondary">
          Browse products
        </Link>
      </div>
    </div>
  );
}
