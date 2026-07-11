import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useCallback, Fragment } from 'react';
import {
  X, Menu, LogOut, ChevronRight, Bell,
  LayoutDashboard, Package, FolderTree, ShoppingCart, Warehouse,
} from 'lucide-react';
import useAuth from '@/features/auth/useAuth';

const sections = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/stock', label: 'Stock', icon: Warehouse },
];

const breadcrumbMap = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/categories': 'Categories',
  '/admin/categories/new': 'Add Category',
  '/admin/orders': 'Orders',
  '/admin/stock': 'Stock',
};

function getBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Admin', path: '/admin' }];

  if (parts.length <= 1) return crumbs;

  let currentPath = '';
  for (let i = 1; i < parts.length; i++) {
    currentPath += '/' + parts[i];
    const isEdit = parts[i] === 'edit';
    const isNew = parts[i] === 'new';

    let label = breadcrumbMap[currentPath];
    if (!label && isEdit) label = 'Edit';
    if (!label && isNew) label = 'New';
    if (!label && parts[i - 1] === 'products') label = 'Product';
    if (!label && parts[i - 1] === 'categories') label = 'Category';
    if (!label && parts[i - 1] === 'orders') label = 'Order';
    if (!label) label = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);

    crumbs.push({ label, path: currentPath });
  }
  return crumbs;
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const crumbs = getBreadcrumbs(location.pathname);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <NavLink to="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-xs font-bold text-white">
            A
          </span>
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-slate-700">
            Admin
          </span>
        </NavLink>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-500 hover:text-slate-700"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        {sections.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Topbar ─── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden items-center gap-1 text-sm sm:flex" aria-label="Breadcrumb">
              {crumbs.map((crumb, idx) => (
                <Fragment key={crumb.path}>
                  {idx > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  {idx === crumbs.length - 1 ? (
                    <span className="font-medium text-slate-900">{crumb.label}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(crumb.path)}
                      className="text-slate-500 transition hover:text-slate-700"
                    >
                      {crumb.label}
                    </button>
                  )}
                </Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-slate-600" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                  {(user?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.full_name || user?.email}</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{user?.full_name || 'Admin'}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Content ─── */}
      <main className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            {sidebarContent}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </main>

      {/* ─── Mobile Sidebar ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </div>
  );
}
