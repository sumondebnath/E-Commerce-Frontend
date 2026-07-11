import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const MainLayout = lazy(() => import('@/common/layout/MainLayout'));
const Home = lazy(() => import('@/pages/Home'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const RequireGuest = lazy(() => import('@/common/auth/RequireGuest'));
const RequireAuth = lazy(() => import('@/common/auth/RequireAuth'));
const AdminRoute = lazy(() => import('@/common/auth/AdminRoute'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));

const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'));
const ProfileLayout = lazy(() => import('@/features/profile/pages/ProfileLayout'));
const EditProfile = lazy(() => import('@/features/profile/pages/EditProfile'));
const AddressesPage = lazy(() => import('@/features/profile/pages/AddressesPage'));
const ChangePassword = lazy(() => import('@/features/profile/pages/ChangePassword'));
const OrderHistory = lazy(() => import('@/features/orders/pages/OrderHistory'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails'));
const ReviewHistory = lazy(() => import('@/features/reviews/pages/ReviewHistory'));
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
const ProductPage = lazy(() => import('@/features/products/pages/ProductPage'));
const CartPage = lazy(() => import('@/features/cart/pages/CartPage'));
const WishlistPage = lazy(() => import('@/features/wishlist/pages/WishlistPage'));
const CheckoutPage = lazy(() => import('@/features/checkout/pages/CheckoutPage'));
const CheckoutSuccess = lazy(() => import('@/features/checkout/pages/CheckoutSuccess'));
const CheckoutFailure = lazy(() => import('@/features/checkout/pages/CheckoutFailure'));

const AdminLayout = lazy(() => import('@/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('@/admin/pages/AdminLoginPage'));
const AdminUnauthorized = lazy(() => import('@/admin/pages/AdminUnauthorized'));
const AdminDashboard = lazy(() => import('@/admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('@/admin/pages/AdminProducts'));
const AdminCategories = lazy(() => import('@/admin/pages/AdminCategories'));
const AdminOrders = lazy(() => import('@/admin/pages/AdminOrders'));
const AdminOrderDetail = lazy(() => import('@/admin/pages/AdminOrderDetail'));
const AdminStock = lazy(() => import('@/admin/pages/AdminStock'));
const AdminProductForm = lazy(() => import('@/admin/pages/AdminProductForm'));
const AdminCategoryForm = lazy(() => import('@/admin/pages/AdminCategoryForm'));

const Loading = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600" />
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* ─── Customer Application ─── */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />

            <Route element={<RequireGuest />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="edit" element={<EditProfile />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="password" element={<ChangePassword />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="reviews" element={<ReviewHistory />} />
              </Route>
            </Route>

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failure" element={<CheckoutFailure />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* ─── Admin Application ─── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />

          <Route element={<AdminRoute redirectTo="/admin/login" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="categories/new" element={<AdminCategoryForm />} />
              <Route path="categories/:id/edit" element={<AdminCategoryForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="stock" element={<AdminStock />} />
            </Route>
          </Route>

          {/* ─── Fallback ─── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
