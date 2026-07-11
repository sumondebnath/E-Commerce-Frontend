import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import useCart from '../hooks/useCart';
import { useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/useCartMutations';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';
import { PageHeaderSkeleton } from '@/common/components/UI/Skeleton';
import ConfirmDialog from '@/common/components/ConfirmDialog';

export default function CartPage() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const clear = useClearCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useDocumentTitle('Cart');

  if (isLoading) {
    return (
      <section className="space-y-8">
        <PageHeaderSkeleton />
        <div className="card-base p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-32 w-32 flex-none rounded-2xl bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/4 rounded bg-slate-200" />
                  <div className="h-10 w-40 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="font-medium text-rose-700">Unable to load cart.</p>
        <button onClick={() => refetch()} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Shopping cart</h1>
            <p className="mt-1 text-sm text-slate-500">
              {cart?.items?.length || 0} item{cart?.items?.length !== 1 ? 's' : ''} in your bag
            </p>
          </div>
          <Link to="/products" className="btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-slate-500">
            Add some products to your cart to get started.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card-base overflow-hidden p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={item.image_url || item.product_image || item.product?.image}
                    alt={item.product_name}
                    className="h-32 w-full flex-none rounded-2xl object-cover sm:w-32"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">${Number(item.product_price || 0).toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          ${Number(item.subtotal || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() =>
                            update.mutate({ id: item.id, payload: { quantity: item.quantity - 1 } })
                          }
                          disabled={item.quantity <= 1 || update.isPending}
                          className="px-3 py-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => update.mutate({ id: item.id, payload: { quantity: item.quantity + 1 } })}
                          className="px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove.mutate(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${Number(cart.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Items</span>
                  <span className="font-semibold text-slate-900">{cart.items.length}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary mt-6 block w-full text-center">
                Proceed to checkout
              </Link>
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="btn-secondary mt-3 w-full"
              >
                Clear cart
              </button>
            </div>
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-slate-900">Need help?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Contact support for questions, returns, and order updates.
              </p>
            </div>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={showClearConfirm}
        title="Clear cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmLabel="Clear cart"
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={() => { clear.mutate(); setShowClearConfirm(false); }}
      />
    </section>
  );
}
