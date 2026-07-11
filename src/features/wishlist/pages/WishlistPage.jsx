import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import useWishlist, { useRemoveFromWishlist } from '../hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCartMutations';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';
import { ProductGridSkeleton } from '@/common/components/UI/Skeleton';

export default function WishlistPage() {
  const { data, isLoading, isError, refetch } = useWishlist();
  const remove = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  useDocumentTitle('Wishlist');

  if (isLoading) return <ProductGridSkeleton />;

  if (isError) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="font-medium text-rose-700">Unable to load wishlist.</p>
        <button onClick={() => refetch()} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  const items = data?.items || [];

  const handleAddToCart = (item) => {
    const prod = item.product_detail || item.product;
    const prodId = prod?.id || item.product;
    addToCart.mutate(
      { product_id: prodId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success('Added to cart');
          remove.mutate(item.id);
        },
      }
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-rose-500" />
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Wishlist</h1>
            <p className="mt-1 text-sm text-slate-500">
              {items.length} item{items.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
        </div>
        <Link to="/products" className="btn-secondary">
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Heart className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-900">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-slate-500">
            Save products you love to revisit them later.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const prod = item.product_detail || item.product;
            const prodId = prod?.id || item.product;
            return (
              <article key={item.id} className="card-base group overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <Link to={`/products/${prodId}`}>
                  <img
                    src={prod?.image_url || prod?.image || prod?.thumbnail}
                    alt={prod?.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
                <div className="p-5">
                  <Link to={`/products/${prodId}`}>
                    <h2 className="text-lg font-semibold text-slate-900">{prod?.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{prod?.category_name || prod?.category || 'Product'}</p>
                  </Link>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xl font-bold text-amber-600">
                      ${Number(prod?.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      disabled={addToCart.isPending}
                      className="btn-primary inline-flex w-full items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {addToCart.isPending ? 'Adding\u2026' : 'Add to cart'}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(item.id)}
                      className="btn-secondary inline-flex w-full items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
