import { Link } from 'react-router-dom';
import { memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { getProduct } from '../services/products.service';

function ProductCard({ product }) {
  const qc = useQueryClient();

  const prefetch = () => {
    if (!product?.id) return;
    qc.prefetchQuery({ queryKey: ['product', product.id], queryFn: () => getProduct(product.id) });
  };

  const inStock = product.in_stock ?? (product.stock_count > 0);

  return (
    <article className="card-base group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/products/${product.id}`}
        className="block"
        onMouseEnter={prefetch}
        onFocus={prefetch}
      >
        <div className="relative overflow-hidden bg-slate-100">
          <img
            src={product.image_url || product.image || product.thumbnail}
            alt={product.name}
            width={400}
            height={240}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {product.average_rating != null && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-amber-600 shadow-sm backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {Number(product.average_rating).toFixed(1)}
            </span>
          )}
          {!inStock && (
            <span className="absolute right-3 top-3 rounded-full bg-rose-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              Out of stock
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {product.category_name || product.category || 'Product'}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-6 text-slate-900 line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xl font-bold text-amber-600">${Number(product.price || 0).toFixed(2)}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                inStock
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  inStock ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              {inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);
