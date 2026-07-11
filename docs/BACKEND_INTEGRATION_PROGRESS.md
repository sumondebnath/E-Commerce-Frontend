# Backend Integration Progress

## Phase 1: Authentication — ✅ Complete
- `src/api/endpoints.js`: All URLs prefixed with `/api/accounts/`, `/api/products/`, `/api/cart/`, `/api/orders/`, `/api/admin/`
- `src/features/auth/services/auth.service.js`: Register sends `first_name`, `last_name`, `password2`; logout sends `{ refresh }`
- `src/features/auth/AuthProvider.jsx`: Logout body includes refresh token; register/login handle backend `{ user, refresh, access }` response shape
- `src/features/auth/components/RegisterForm.jsx`: Fields changed to `first_name`/`last_name`, added `password2`
- `src/features/auth/components/LoginForm.jsx`: No changes needed (email+password works)
- `src/features/profile/pages/EditProfile.jsx`: Uses `first_name`/`last_name` (not `name`)
- `src/features/profile/pages/ChangePassword.jsx`: Uses `old_password`/`new_password`/`new_password2` (backend fields)
- `src/features/profile/services/profile.service.js`: Cleaned up
- `user?.name` → `user?.full_name` in MainLayout.jsx, ProfilePage.jsx

## Phase 2: Products & Categories — ✅ Complete
- Product field names: `name` (was `title`), `stock_count` (was `stock`), `image_url` (was `image`/`thumbnail`), `average_rating` (was `rating`), `category_name` (was `category`)
- `src/features/products/components/ProductCard.jsx`: All fields updated
- `src/features/products/pages/ProductPage.jsx`: All fields updated, cart mutation uses `product_id`
- `src/features/products/services/reviews.service.js`: Uses query-param filtering `?product=<id>`
- `src/features/products/hooks/useReviews.js`: Cleaned up

## Phase 3: Cart — ✅ Complete
- Backend cart is a flat response (not nested `product` object), adapted via service
- `src/features/cart/services/cart.service.js`: Fetches from `/api/cart/`, wraps in `{ items, total }` shape
- `src/features/cart/pages/CartPage.jsx`: Uses `item.product_name`, `item.product_price`, `item.product_image`, `item.subtotal`
- `src/features/cart/components/CartDrawer.jsx`: Same field updates

## Phase 4: Wishlist — ✅ Complete
- Backend at `/api/products/watchlist/`, returns flat list with `product_detail` nested object
- `src/features/wishlist/services/wishlist.service.js`: Wraps backend array in `{ items }`
- `src/features/wishlist/pages/WishlistPage.jsx`: Uses `product_detail.name`, `product_detail.image_url`, `product_detail.price`
- `src/features/wishlist/hooks/useWishlist.js`: Cleaned up

## Phase 5: Checkout & Addresses — ✅ Complete
- Address fields: `address_type`, `street_address`, `city`, `state`, `postal_code`, `country`, `is_default`
- `src/features/profile/pages/AddressesPage.jsx`: All address fields updated, form uses correct fields
- `src/features/checkout/services/orders.service.js`: Uses `ORDERS.CHECKOUT` (`/api/orders/checkout/`)
- `src/features/checkout/hooks/useCreateOrder.js`: Invalidates cart on success
- `src/features/checkout/pages/CheckoutPage.jsx`: Uses `address_id`, `payment_method`, `shipping_cost` payload; flat cart fields

## Phase 6: Orders — ✅ Complete
- `src/features/orders/services/orders.service.js`: Fixed URL bug — uses `ORDERS.LIST` (was `ORDERS.CREATE`)
- `src/features/orders/pages/OrderDetails.jsx`: Uses `order_status`, `total_amount`, `subtotal_amount`, `shipping_cost`, `price_at_purchase`, `product_name_snapshot`, `line_total`; shows shipping address from flat fields
- `src/features/orders/pages/OrderHistory.jsx`: Uses `order_status`, `total_amount`; handles paginated response `{ results, count }`

## Phase 7: Admin — ✅ Complete
- `src/admin/pages/AdminDashboard.jsx`: Uses nested response `orders.total`, `users.total`, `revenue.total`
- `src/admin/pages/AdminOrders.jsx`: Uses `ORDERS.LIST` for listing; `ADMIN.ORDER_STATUS` (`PATCH /api/admin/orders/:id/status/`) for status updates; field names match backend
- `src/admin/pages/AdminStock.jsx`: Uses `PRODUCTS.LIST` for listing; `ADMIN.PRODUCT_STOCK` (`PATCH /api/admin/products/:id/stock/`) for stock updates
- `src/admin/pages/AdminProducts.jsx`: Uses `PRODUCTS.LIST`/`PRODUCTS.DETAIL` for CRUD; fields: `name`, `stock_count`
- `src/admin/pages/AdminProductForm.jsx`: Uses `name`, `stock_count`, `category_id`; fetches categories from `CATEGORIES.LIST`

## Phase 8: Final QA & Build — ✅ Complete
- Build succeeds with 0 errors, 0 warnings
- All 48 TODO(API) comments in edited files have been removed and replaced with correct code

## Phase 9: Payment — ⏸️ Deferred
- Payment gateway integration intentionally deferred per requirements
- All payment services (Stripe, SSLCommerz, ShurjoPay, bKash) remain placeholder stubs

## Known Limitations
1. **Admin order listing**: Backend `OrderViewSet` filters by user for all users including staff. Admin can only see their own orders via `/api/orders/`. Full admin order listing needs a backend change.
2. **My Reviews page**: Backend has no user-filtered reviews endpoint. `ReviewHistory` fetches all reviews from `/api/products/reviews/`.
3. **Coupon validation**: No backend endpoint exists. Checkout coupon field is decorative.
4. **Related products**: No backend endpoint exists.
5. **Product image upload**: `AdminProductForm` has no upload field (backend accepts `MultiPartParser` — upload would work if a file input were added).
6. **Payment gateways**: All placeholder — no real payment processing.

## Test Plan
1. Start backend: `cd /path/to/E_Commerce_backend && python manage.py runserver`
2. Start frontend: `npm run dev`
3. Test: Register → Login → Browse products → Add to cart → Add address → Checkout → View orders
4. Test admin: Login as staff → Dashboard → Orders (status updates) → Products (CRUD) → Stock (inline updates)
