import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Sparkles, Shield, Headphones } from 'lucide-react';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

const features = [
  { icon: Truck, title: 'Fast shipping', desc: 'Get your orders delivered quickly and reliably.' },
  { icon: Sparkles, title: 'Curated collections', desc: 'Hand-picked products for every style and need.' },
  { icon: Shield, title: 'Secure payment', desc: 'Your data is encrypted and your payment is protected.' },
  { icon: Headphones, title: '24/7 support', desc: 'We are here to help anytime you need assistance.' },
];

const highlights = [
  { title: 'Popular collection', desc: 'Shop categories curated for everyday essentials.' },
  { title: 'Secure checkout', desc: 'Fast checkout and order tracking from cart to delivery.' },
  { title: 'Customer care', desc: 'Responsive support and order updates every step of the way.' },
];

export default function Home() {
  useDocumentTitle(null);

  return (
    <section className="space-y-10">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
              Premium ecommerce
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Shop beautiful products with a clean, modern storefront.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Discover curated collections, flexible checkout, and a polished shopping experience
                built for modern brands and fast conversions.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                Shop products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/wishlist" className="btn-secondary inline-flex w-full items-center justify-center sm:w-auto">
                View wishlist
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:shadow-md"
              >
                <f.icon className="h-6 w-6 text-amber-600" />
                <p className="mt-4 text-sm font-semibold text-slate-900">{f.title}</p>
                <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.title} className="card-base p-6 transition hover:shadow-md">
            <h2 className="text-xl font-semibold text-slate-900">{h.title}</h2>
            <p className="mt-3 text-sm text-slate-500">{h.desc}</p>
          </div>
        ))}
      </section>
    </section>
  );
}
