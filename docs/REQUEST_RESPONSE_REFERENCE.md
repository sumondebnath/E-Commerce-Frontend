# Request/Response Reference

---

## POST /auth/login/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | `{ email: string, password: string }` |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | Needs Backend Verification |
| **Frontend Service** | `features/auth/services/auth.service.js` → `login()` |
| **Related Hook** | `AuthProvider.login()` |
| **Related Components** | `LoginForm` |
| **Related Pages** | `LoginPage` |

---

## POST /auth/register/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | `{ email: string, password: string, name: string }` |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | Needs Backend Verification |
| **Frontend Service** | `features/auth/services/auth.service.js` → `register()` |
| **Related Hook** | `AuthProvider.register()` |
| **Related Components** | `RegisterForm` |
| **Related Pages** | `RegisterPage` |

---

## POST /auth/refresh/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | `{ refresh: string }` (optional) |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | Needs Backend Verification |
| **Frontend Service** | `features/auth/services/auth.service.js` → `refresh()` |
| **Related Hook** | `AuthProvider.handleRefresh()` |
| **Related Components** | None (internal) |
| **Related Pages** | None |

---

## POST /auth/logout/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | Needs Backend Verification |
| **Frontend Service** | `features/auth/services/auth.service.js` → `logout()` |
| **Related Hook** | `AuthProvider.logout()` |
| **Related Components** | None (called from nav/profile) |
| **Related Pages** | None |

---

## GET /auth/profile/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | `{ id, email, name?, username?, role?, roles? }` — Needs Backend Verification |
| **Possible Error Responses** | 401 Unauthorized |
| **Frontend Service** | `features/auth/services/auth.service.js` → `getProfile()` |
| **Related Hook** | `AuthProvider.bootstrap()` |
| **Related Components** | `ProfilePage`, nav bars |
| **Related Pages** | `ProfilePage` |

---

## PATCH /auth/profile/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ name?: string, email?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Returns updated user object — Needs Backend Verification |
| **Possible Error Responses** | 400 Validation Error, 401 Unauthorized |
| **Frontend Service** | `features/profile/services/profile.service.js` → `updateProfile()` |
| **Related Hook** | Inline `useMutation` in `EditProfile` |
| **Related Components** | None |
| **Related Pages** | `EditProfile` |

---

## POST /auth/change-password/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ current_password: string, new_password: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | Needs Backend Verification |
| **Frontend Service** | `features/profile/services/profile.service.js` → `changePassword()` |
| **Related Hook** | Inline `useMutation` in `ChangePassword` |
| **Related Components** | None |
| **Related Pages** | `ChangePassword` |

---

## GET /products/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | None |
| **Query Parameters** | `search`, `category`, `page`, `page_size`, `ordering` — Needs Backend Verification |
| **Expected Success Response** | `{ results: Product[], count: number }` — Needs Backend Verification |
| **Possible Error Responses** | None expected |
| **Frontend Service** | `features/products/services/products.service.js` → `getProducts()` |
| **Related Hook** | `useProducts(params)` |
| **Related Components** | `ProductGrid`, `ProductCard`, `ProductFilters` |
| **Related Pages** | `ProductsPage` |

---

## GET /products/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Single product object — Needs Backend Verification |
| **Possible Error Responses** | 404 Not Found |
| **Frontend Service** | `features/products/services/products.service.js` → `getProduct()` |
| **Related Hook** | `useProduct(id)` |
| **Related Components** | None |
| **Related Pages** | `ProductPage` |

---

## GET /categories/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | List of categories — Needs Backend Verification |
| **Possible Error Responses** | None expected |
| **Frontend Service** | `features/products/services/categories.service.js` → `getCategories()` |
| **Related Hook** | `useCategories()` |
| **Related Components** | `ProductFilters` |
| **Related Pages** | `ProductsPage` |

---

## GET /products/:id/reviews/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | None |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | List of reviews — Needs Backend Verification |
| **Possible Error Responses** | 404 Not Found |
| **Frontend Service** | `features/products/services/reviews.service.js` → `getReviews()` |
| **Related Hook** | `useReviews(productId)` |
| **Related Components** | None |
| **Related Pages** | `ProductPage` |

---

## POST /products/:id/reviews/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ comment: string, rating?: number }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created review object — Needs Backend Verification |
| **Possible Error Responses** | 400 Validation Error, 401 Unauthorized |
| **Frontend Service** | `features/products/services/reviews.service.js` → `createReview()` |
| **Related Hook** | `useCreateReview(productId)` |
| **Related Components** | `ReviewForm` (inline in ProductPage) |
| **Related Pages** | `ProductPage` |

---

## GET /reviews/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | Needs Backend Verification |
| **Expected Success Response** | List of user's reviews — Needs Backend Verification |
| **Possible Error Responses** | 401 Unauthorized |
| **Frontend Service** | `features/reviews/services/reviews.service.js` → `getUserReviews()` |
| **Related Hook** | Inline `useQuery` in `ReviewHistory` |
| **Related Components** | None |
| **Related Pages** | `ReviewHistory` |

---

## GET /cart/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | `{ items: CartItem[], total: number }` — Needs Backend Verification |
| **Possible Error Responses** | 401 Unauthorized |
| **Frontend Service** | `features/cart/services/cart.service.js` → `getCart()` |
| **Related Hook** | `useCart()` |
| **Related Components** | `CartDrawer` |
| **Related Pages** | `CartPage` |

---

## POST /cart/items/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ product: number, quantity: number }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created cart item — Needs Backend Verification |
| **Possible Error Responses** | 400 Validation Error, 401 Unauthorized |
| **Frontend Service** | `features/cart/services/cart.service.js` → `addCartItem()` |
| **Related Hook** | `useAddToCart()` |
| **Related Components** | `CartDrawer`, `ProductPage`, `WishlistPage` |
| **Related Pages** | `ProductPage`, `WishlistPage`, `CartPage` |

---

## PATCH /cart/items/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ quantity: number }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Updated cart item — Needs Backend Verification |
| **Possible Error Responses** | 400, 401, 404 |
| **Frontend Service** | `features/cart/services/cart.service.js` → `updateCartItem()` |
| **Related Hook** | `useUpdateCartItem()` |
| **Related Components** | `CartDrawer` |
| **Related Pages** | `CartPage` |

---

## DELETE /cart/items/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401, 404 |
| **Frontend Service** | `features/cart/services/cart.service.js` → `removeCartItem()` |
| **Related Hook** | `useRemoveCartItem()` |
| **Related Components** | `CartDrawer` |
| **Related Pages** | `CartPage` |

---

## POST /cart/clear/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None (Needs Backend Verification) |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401 |
| **Frontend Service** | `features/cart/services/cart.service.js` → `clearCart()` |
| **Related Hook** | `useClearCart()` |
| **Related Components** | None |
| **Related Pages** | `CartPage` |

---

## GET /wishlist/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | `{ items: WishlistItem[] }` — Needs Backend Verification |
| **Possible Error Responses** | 401 |
| **Frontend Service** | `features/wishlist/services/wishlist.service.js` → `getWishlist()` |
| **Related Hook** | `useWishlist()` |
| **Related Components** | None |
| **Related Pages** | `WishlistPage` |

---

## POST /wishlist/items/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ product: number }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created wishlist item — Needs Backend Verification |
| **Possible Error Responses** | 400, 401 |
| **Frontend Service** | `features/wishlist/services/wishlist.service.js` → `addWishlistItem()` |
| **Related Hook** | `useAddToWishlist()` |
| **Related Components** | None |
| **Related Pages** | `ProductPage`, `WishlistPage` |

---

## DELETE /wishlist/items/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401, 404 |
| **Frontend Service** | `features/wishlist/services/wishlist.service.js` → `removeWishlistItem()` |
| **Related Hook** | `useRemoveFromWishlist()` |
| **Related Components** | None |
| **Related Pages** | `WishlistPage` |

---

## GET /addresses/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | List of addresses — Needs Backend Verification |
| **Possible Error Responses** | 401 |
| **Frontend Service** | `features/checkout/services/addresses.service.js` → `getAddresses()` |
| **Related Hook** | `useAddresses()` |
| **Related Components** | None |
| **Related Pages** | `AddressesPage`, `CheckoutPage` |

---

## POST /addresses/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ full_name: string, line1: string, city: string, postcode: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created address — Needs Backend Verification |
| **Possible Error Responses** | 400, 401 |
| **Frontend Service** | `features/checkout/services/addresses.service.js` → `createAddress()` |
| **Related Hook** | Inline `useMutation` in `AddressesPage` |
| **Related Components** | None |
| **Related Pages** | `AddressesPage` |

---

## PATCH /addresses/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ full_name?: string, line1?: string, city?: string, postcode?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Updated address — Needs Backend Verification |
| **Possible Error Responses** | 400, 401, 404 |
| **Frontend Service** | `features/checkout/services/addresses.service.js` → `updateAddress()` |
| **Related Hook** | Inline `useMutation` in `AddressesPage` |
| **Related Components** | None |
| **Related Pages** | `AddressesPage` |

---

## DELETE /addresses/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401, 404 |
| **Frontend Service** | `features/checkout/services/addresses.service.js` → `deleteAddress()` |
| **Related Hook** | Inline `useMutation` in `AddressesPage` |
| **Related Components** | None |
| **Related Pages** | `AddressesPage` |

---

## POST /orders/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | `{ items: { product: number, quantity: number }[], address: number, shipping_method: string, coupon?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created order object — Needs Backend Verification |
| **Possible Error Responses** | 400, 401 |
| **Frontend Service** | `features/checkout/services/orders.service.js` → `createOrder()` |
| **Related Hook** | `useCreateOrder()` |
| **Related Components** | None |
| **Related Pages** | `CheckoutPage` |

---

## GET /orders/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | Needs Backend Verification |
| **Expected Success Response** | List of orders — Needs Backend Verification |
| **Possible Error Responses** | 401 |
| **Frontend Service** | `features/orders/services/orders.service.js` → `getOrders()` |
| **Related Hook** | Inline `useQuery` in `OrderHistory` |
| **Related Components** | None |
| **Related Pages** | `OrderHistory` |

---

## GET /orders/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Single order object — Needs Backend Verification |
| **Possible Error Responses** | 401, 404 |
| **Frontend Service** | `features/checkout/services/orders.service.js` → `getOrder()` |
| **Related Hook** | Inline `useQuery` in `OrderDetails` |
| **Related Components** | None |
| **Related Pages** | `OrderDetails` |

---

## GET /admin/stats/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | `{ orders_total: number, users_total: number, revenue: number }` — Needs Backend Verification |
| **Possible Error Responses** | 401, 403 |
| **Frontend Service** | Inline `api.get()` in `AdminDashboard` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | None |
| **Related Pages** | `AdminDashboard` |

---

## GET /admin/products/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | `page`, `search`, `page_size` — Needs Backend Verification |
| **Expected Success Response** | `{ results: Product[], count: number }` — Needs Backend Verification |
| **Possible Error Responses** | 401, 403 |
| **Frontend Service** | Inline `api.get()` in `AdminProducts` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | `Table` |
| **Related Pages** | `AdminProducts` |

---

## POST /admin/products/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json`, `Authorization: Bearer token` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | `{ title: string, price: number, stock: number, category?: number, description?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created product — Needs Backend Verification |
| **Possible Error Responses** | 400, 401, 403 |
| **Frontend Service** | Inline `api.post()` in `AdminProductForm` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminProductForm` |

---

## GET /admin/products/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Single product — Needs Backend Verification |
| **Possible Error Responses** | 401, 403, 404 |
| **Frontend Service** | Inline `api.get()` in `AdminProductForm` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | None |
| **Related Pages** | `AdminProductForm` |

---

## PATCH /admin/products/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | `{ title?: string, price?: number, stock?: number, category?: number, description?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Updated product — Needs Backend Verification |
| **Possible Error Responses** | 400, 401, 403, 404 |
| **Frontend Service** | Inline `api.patch()` in `AdminProductForm` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminProductForm` |

---

## DELETE /admin/products/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401, 403, 404 |
| **Frontend Service** | Inline `api.delete()` in `AdminProducts` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminProducts` |

---

## GET /admin/categories/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | `page`, `search`, `page_size` — Needs Backend Verification |
| **Expected Success Response** | `{ results: Category[], count: number }` — Needs Backend Verification |
| **Possible Error Responses** | 401, 403 |
| **Frontend Service** | Inline `api.get()` in `AdminCategories` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | `Table` |
| **Related Pages** | `AdminCategories` |

---

## POST /admin/categories/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | `{ name: string, description?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Created category — Needs Backend Verification |
| **Possible Error Responses** | 400, 401, 403 |
| **Frontend Service** | Inline `api.post()` in `AdminCategoryForm` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminCategoryForm` |

---

## GET /admin/categories/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Single category — Needs Backend Verification |
| **Possible Error Responses** | 401, 403, 404 |
| **Frontend Service** | Inline `api.get()` in `AdminCategoryForm` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | None |
| **Related Pages** | `AdminCategoryForm` |

---

## PATCH /admin/categories/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | `{ name?: string, description?: string }` — Needs Backend Verification |
| **Query Parameters** | None |
| **Expected Success Response** | Updated category — Needs Backend Verification |
| **Possible Error Responses** | 400, 401, 403, 404 |
| **Frontend Service** | Inline `api.patch()` in `AdminCategoryForm` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminCategoryForm` |

---

## DELETE /admin/categories/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401, 403, 404 |
| **Frontend Service** | Inline `api.delete()` in `AdminCategories` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminCategories` |

---

## GET /admin/orders/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | `page`, `search`, `page_size` — Needs Backend Verification |
| **Expected Success Response** | `{ results: Order[], count: number }` — Needs Backend Verification |
| **Possible Error Responses** | 401, 403 |
| **Frontend Service** | Inline `api.get()` in `AdminOrders` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | `Table` |
| **Related Pages** | `AdminOrders` |

---

## DELETE /admin/orders/:id/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | None |
| **Expected Success Response** | Needs Backend Verification |
| **Possible Error Responses** | 401, 403, 404 |
| **Frontend Service** | Inline `api.delete()` in `AdminOrders` |
| **Related Hook** | Inline `useMutation` |
| **Related Components** | None |
| **Related Pages** | `AdminOrders` |

---

## GET /admin/stock/

| Field | Value |
|-------|-------|
| **Headers** | `Content-Type: application/json` |
| **Authentication** | Bearer token (admin role) |
| **Request Body** | None |
| **Query Parameters** | `page`, `search`, `page_size` — Needs Backend Verification |
| **Expected Success Response** | `{ results: Product[], count: number }` — Needs Backend Verification |
| **Possible Error Responses** | 401, 403 |
| **Frontend Service** | Inline `api.get()` in `AdminStock` |
| **Related Hook** | Inline `useQuery` |
| **Related Components** | `Table` |
| **Related Pages** | `AdminStock` |
