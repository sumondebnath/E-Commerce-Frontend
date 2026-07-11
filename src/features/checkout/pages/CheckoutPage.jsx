import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import useCart from '@/features/cart/hooks/useCart';
import useAddresses from '../hooks/useAddresses';
import useCreateOrder from '../hooks/useCreateOrder';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const addressesQ = useAddresses();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  useDocumentTitle('Checkout');

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(5.0);

  const addresses = addressesQ.data || [];
  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
  if (defaultAddress && !selectedAddress) {
    setSelectedAddress(defaultAddress);
  }

  if (cartLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading checkout\u2026
      </div>
    );
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
        <p className="mt-2 text-sm text-slate-500">Add items to your cart before checking out.</p>
        <Link to="/products" className="btn-primary mt-6 inline-block">
          Browse products
        </Link>
      </div>
    );
  }

  const subtotal = Number(cart?.total) || 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    const payload = {
      address_id: selectedAddress.id,
      payment_method: 'stripe',
      shipping_cost: String(shippingCost),
    };
    createOrder.mutate(payload, {
      onSuccess: (data) => navigate('/checkout/success', { state: { order: data } }),
      onError: (err) => {
        const msg = err?.response?.data?.detail || err?.message || 'Order failed';
        navigate('/checkout/failure', { state: { error: msg } });
      },
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
      <div className="space-y-6">
        <section className="card-base p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Shipping address</h1>
              <p className="text-sm text-slate-500">Choose where to send your order.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {addressesQ.isLoading ? (
              <div className="text-sm text-slate-500">Loading addresses\u2026</div>
            ) : addressesQ.isError ? (
              <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Unable to load addresses.
              </div>
            ) : (
              <div className="space-y-3">
                {(addressesQ.data?.length || 0) === 0 ? (
                  <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    No addresses saved yet. Add one to continue.
                  </div>
                ) : (
                  (addressesQ.data || []).map((a) => (
                    <label
                      key={a.id}
                      className="flex cursor-pointer items-start gap-4 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === a.id}
                        onChange={() => setSelectedAddress(a)}
                        className="mt-1 h-4 w-4 text-amber-600"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {a.address_type === 'billing' ? 'Billing' : 'Shipping'}
                          {a.is_default && <span className="ml-2 text-xs text-amber-600">(Default)</span>}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {a.street_address}, {a.city}, {a.state}, {a.postal_code}, {a.country}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            to="/profile/addresses"
            className="btn-secondary mt-6 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add new address
          </Link>
        </section>

        <section className="card-base p-6">
          <h2 className="text-xl font-semibold text-slate-900">Shipping method</h2>
          <div className="mt-4 space-y-3">
            {[
              { value: 5, label: 'Standard shipping', time: '3\u20135 business days' },
              { value: 12, label: 'Express shipping', time: '1\u20132 business days' },
            ].map(({ value, label, time }) => (
              <label
                key={value}
                className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
              >
                <input
                  type="radio"
                  name="ship"
                  checked={shippingCost === value}
                  onChange={() => setShippingCost(value)}
                  className="h-4 w-4 text-amber-600"
                />
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-sm text-slate-600">{time}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="card-base p-6">
          <h2 className="text-xl font-semibold text-slate-900">Payment</h2>
          <p className="mt-3 text-sm text-slate-600">
            Payment gateway will be integrated here in a future update.
          </p>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="card-base p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
              <p className="text-sm text-slate-500">Review items before checkout.</p>
            </div>
            <span className="inline-flex items-center justify-center rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              {(cart.items || []).length} item{(cart.items || []).length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="mt-6 space-y-3 border-b border-slate-200 pb-4 text-sm">
            {(cart.items || []).slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-slate-600">
                <span className="truncate">
                  {item.product_name} &times; {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-slate-900">
                  ${Number(item.subtotal || 0).toFixed(2)}
                </span>
              </div>
            ))}
            {(cart.items || []).length > 3 && (
              <p className="text-xs text-slate-400">
                +{cart.items.length - 3} more item{cart.items.length - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-3">
              <label className="block text-xs font-medium text-slate-500">Coupon code</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  disabled
                  placeholder="Coming soon"
                  className="input-base flex-1 text-sm"
                />
                <button type="button" disabled className="btn-secondary shrink-0 text-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3 text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-3 text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-slate-900">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base">
              <span className="font-medium text-slate-900">Total</span>
              <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={createOrder.isPending}
            className="btn-primary mt-4 w-full"
          >
            {createOrder.isPending ? 'Processing\u2026' : 'Place order'}
          </button>
        </div>
      </aside>
    </div>
  );
}
