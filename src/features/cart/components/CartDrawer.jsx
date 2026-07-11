import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import useCart from '../hooks/useCart';
import { useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/useCartMutations';
import { Link } from 'react-router-dom';
import ConfirmDialog from '@/common/components/ConfirmDialog';

export default function CartDrawer({ open, onClose }) {
  const { data: cart, isLoading } = useCart();
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const clear = useClearCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 flex w-full transform transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your cart</h2>
            <p className="text-sm text-slate-500">{cart?.items?.length || 0} item(s)</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex gap-3">
                    <div className="h-16 w-16 flex-none rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/3 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-slate-300" />
              <p className="mt-4 font-medium text-slate-600">Your cart is empty</p>
              <p className="mt-1 text-sm text-slate-400">Add items to get started.</p>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary mt-6"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <img
                    src={item.image_url || item.product_image || item.product?.image}
                    alt={item.product_name}
                    className="h-20 w-20 flex-none rounded-2xl object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.product_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      ${Number(item.product_price || 0).toFixed(2)} &times; {item.quantity}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            update.mutate({ id: item.id, payload: { quantity: item.quantity - 1 } })
                          }
                          disabled={item.quantity <= 1 || update.isPending}
                          className="px-3 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
                          disabled={update.isPending}
                          className="px-3 py-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove.mutate(item.id)}
                        disabled={remove.isPending}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-40"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Subtotal</span>
            <span className="text-xl font-bold text-slate-900">
              ${Number(cart?.total || 0).toFixed(2)}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center"
            >
              Checkout
            </Link>
            <button type="button" onClick={() => setShowClearConfirm(true)} className="btn-secondary w-full">
              Clear cart
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={showClearConfirm}
        title="Clear cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmLabel="Clear cart"
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={() => { clear.mutate(); setShowClearConfirm(false); }}
      />
    </div>
  );
}
