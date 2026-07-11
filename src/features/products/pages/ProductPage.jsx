import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useProduct from '../hooks/useProduct';
import { useReviews, useCreateReview } from '../hooks/useReviews';
import { useAddToCart } from '@/features/cart/hooks/useCartMutations';
import { useAddToWishlist } from '@/features/wishlist/hooks/useWishlist';
import useAuth from '@/features/auth/useAuth';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';
import Textarea from '@/common/components/UI/Textarea';
import RelatedProducts from '../components/RelatedProducts';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const reviewsQuery = useReviews(id);
  const createReview = useCreateReview(id);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  useDocumentTitle(product?.name ? `${product.name} — Shop` : 'Product');

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/products/${id}` } });
      return;
    }
    addToCart.mutate(
      { product_id: product.id, quantity: 1 },
      { onSuccess: () => toast.success('Added to cart') }
    );
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    addToWishlist.mutate(
      { product: product.id },
      { onSuccess: () => toast.success('Added to wishlist') }
    );
  };

  if (isLoading)
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading product…
      </div>
    );
  if (isError)
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
        <p className="font-medium">Error loading product.</p>
        <button onClick={() => refetch()} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );

  if (!product) return null;

  const inStock = product.in_stock ?? (product.stock_count > 0);
  const reviews = reviewsQuery.data ?? product.reviews ?? [];
  const reviewCount = product.review_count ?? reviews.length;

  return (
    <section className="space-y-8">
      {product && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.image_url || product.image || product.thumbnail,
          brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
          offers: {
            "@type": "Offer",
            price: Number(product.price) || 0,
            priceCurrency: "USD",
            availability: (product.in_stock ?? (product.stock_count > 0))
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: window.location.href,
          },
          aggregateRating: (product.average_rating || product.rating) && reviewCount > 0 ? {
            "@type": "AggregateRating",
            ratingValue: Number(product.average_rating || product.rating),
            reviewCount: reviewCount,
          } : undefined,
        }) }} />
      )}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100">
            <img
              src={product.image_url || product.image || product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  {product.category_name || product.category?.name || 'Featured item'}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                  {product.name}
                </h1>
              </div>
              <div className="rounded-[1.25rem] bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                ${Number(product.price || 0).toFixed(2)}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Stock</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {inStock ? 'Available' : 'Out of stock'}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Category</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {product.category?.name || product.category_name || 'General'}
                </p>
              </div>
            </div>
            <div className="prose max-w-none text-slate-700">{product.description}</div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card-base p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">${Number(product.price || 0).toFixed(2)}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                {product.average_rating != null ? `${Number(product.average_rating).toFixed(1)} ★` : 'New'}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="btn-primary w-full"
              >
                {addToCart.isPending ? 'Adding…' : 'Add to cart'}
              </button>
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={addToWishlist.isPending}
                className="btn-secondary w-full"
              >
                {addToWishlist.isPending ? 'Adding…' : 'Add to wishlist'}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Customer reviews</h2>
          <p className="text-sm text-slate-500">{reviewCount} reviews</p>
        </div>

        {reviews.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{r.user_name || r.user}</p>
                  {r.rating != null && (
                    <span className="text-sm text-amber-600">{'★'.repeat(Math.min(5, Math.max(0, Math.round(r.rating))))}{'☆'.repeat(Math.max(0, 5 - Math.round(r.rating)))}</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {isAuthenticated && (
          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-base font-semibold text-slate-900">Write a review</h3>
            <ReviewForm
              onSubmit={(payload) => createReview.mutate(payload)}
              loading={createReview.isPending}
            />
          </div>
        )}
      </section>

      <RelatedProducts
        categoryId={product.category?.id}
        excludeId={product.id}
      />
    </section>
  );
}

function ReviewForm({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ rating, comment: text });
    setText('');
    setRating(5);
  };
  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Rating</label>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`h-6 w-6 text-lg ${star <= (hover || rating) ? 'text-amber-400' : 'text-slate-200'} transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Textarea
        label="Review"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Share your experience"
      />
      <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
        {loading ? 'Posting…' : 'Post review'}
      </button>
    </form>
  );
}
