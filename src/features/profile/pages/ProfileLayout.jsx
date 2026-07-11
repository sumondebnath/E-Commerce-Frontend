import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, Settings, MapPin, Lock, Package, MessageSquare, Heart } from 'lucide-react';
import useAuth from '@/features/auth/useAuth';

const navItems = [
  { to: '/profile', label: 'Overview', icon: User },
  { to: '/profile/edit', label: 'Edit profile', icon: Settings },
  { to: '/profile/addresses', label: 'Addresses', icon: MapPin },
  { to: '/profile/password', label: 'Change password', icon: Lock },
  { to: '/profile/orders', label: 'Orders', icon: Package },
  { to: '/profile/reviews', label: 'Reviews', icon: MessageSquare },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
];

export default function ProfileLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isOverview = location.pathname === '/profile';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-lg font-bold text-amber-700">
            {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{user?.full_name || user?.email || 'User'}</p>
            <p className="truncate text-sm text-slate-500">{user?.email || ''}</p>
          </div>
        </div>
        <nav className="space-y-1" aria-label="Account navigation">
          {navItems.map((item) => {
            const isActive = item.to === '/profile' ? isOverview : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="space-y-6">
        <Outlet />
      </main>
    </div>
  );
}
