import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Menu, X, ShoppingCart, Heart, Package, User, LogOut } from 'lucide-react';
import CartDrawer from '@/features/cart/components/CartDrawer';
import useCart from '@/features/cart/hooks/useCart';
import useAuth from '@/features/auth/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/wishlist', label: 'Wishlist' },
];

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const { data: cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const count = (cart?.items || []).reduce((s, it) => s + (it.quantity || 0), 0);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-amber-500"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
            onClick={() => setNavOpen(false)}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white text-sm font-bold">
              S
            </span>
            <span className="hidden sm:inline">Shop</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((item) => {
              const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Open cart, ${count} items`}
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-2 md:flex">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {user?.full_name || user?.email}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700"
                >
                  Sign in
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setNavOpen((o) => !o)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:hidden"
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={navOpen}
            >
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="space-y-1 px-4 py-3" aria-label="Mobile navigation">
              {navLinks.map((item) => {
                const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setNavOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label === 'Home' && <Package className="h-4 w-4" />}
                    {item.label === 'Products' && <ShoppingCart className="h-4 w-4" />}
                    {item.label === 'Wishlist' && <Heart className="h-4 w-4" />}
                    {item.label}
                  </Link>
                );
              })}
              <hr className="my-2 border-slate-200" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    <User className="h-4 w-4" />
                    {user?.full_name || user?.email}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { handleLogout(); setNavOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setNavOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-amber-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-700"
                >
                  <User className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white text-xs font-bold">
                S
              </span>
              Shop
            </Link>
            <p className="max-w-xs text-sm text-slate-500">
              Premium ecommerce storefront built for modern brands and fast conversions.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/products" className="text-slate-500 transition hover:text-slate-900">
              Products
            </Link>
            <Link to="/cart" className="text-slate-500 transition hover:text-slate-900">
              Cart
            </Link>
            <Link to="/wishlist" className="text-slate-500 transition hover:text-slate-900">
              Wishlist
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="text-slate-500 transition hover:text-slate-900">
                Profile
              </Link>
            )}
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Shop. All rights reserved.
          </p>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
