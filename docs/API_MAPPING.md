# API Mapping

| Feature | Frontend Service | React Query Hook | Backend Endpoint | HTTP Method | Auth Required | Status |
|---------|-----------------|------------------|------------------|-------------|---------------|--------|
| **Authentication** | | | | | | |
| Login | `auth.service.js` → `login()` | — (AuthProvider) | `/auth/login/` | POST | No | Needs Backend Verification |
| Register | `auth.service.js` → `register()` | — (AuthProvider) | `/auth/register/` | POST | No | Needs Backend Verification |
| Token Refresh | `auth.service.js` → `refresh()` | — (AuthProvider) | `/auth/refresh/` | POST | No | Needs Backend Verification |
| Logout | `auth.service.js` → `logout()` | — (AuthProvider) | `/auth/logout/` | POST | Yes | Needs Backend Verification |
| Get Profile | `auth.service.js` → `getProfile()` | — (AuthProvider) | `/auth/profile/` | GET | Yes | Needs Backend Verification |
| Update Profile | `profile.service.js` → `updateProfile()` | — (EditProfile mutation) | `/auth/profile/` | PATCH | Yes | Needs Backend Verification |
| Change Password | `profile.service.js` → `changePassword()` | — (ChangePassword mutation) | `/auth/change-password/` | POST | Yes | Needs Backend Verification |

| **Products** | | | | | | |
| List Products | `products.service.js` → `getProducts()` | `useProducts()` | `/products/` | GET | No | Needs Backend Verification |
| Product Detail | `products.service.js` → `getProduct()` | `useProduct()` | `/products/:id/` | GET | No | Needs Backend Verification |

| **Categories** | | | | | | |
| List Categories | `categories.service.js` → `getCategories()` | `useCategories()` | `/categories/` | GET | No | Needs Backend Verification |

| **Reviews** | | | | | | |
| Product Reviews | `reviews.service.js` → `getReviews()` | `useReviews()` | `/products/:id/reviews/` | GET | No | Needs Backend Verification |
| Create Review | `reviews.service.js` → `createReview()` | `useCreateReview()` | `/products/:id/reviews/` | POST | Yes | Needs Backend Verification |
| User's Reviews | `reviews.service.js` → `getUserReviews()` | — (ReviewHistory) | `/reviews/` | GET | Yes | Needs Backend Verification |

| **Cart** | | | | | | |
| Get Cart | `cart.service.js` → `getCart()` | `useCart()` | `/cart/` | GET | Yes | Needs Backend Verification |
| Add to Cart | `cart.service.js` → `addCartItem()` | `useAddToCart()` | `/cart/items/` | POST | Yes | Needs Backend Verification |
| Update Cart Item | `cart.service.js` → `updateCartItem()` | `useUpdateCartItem()` | `/cart/items/:id/` | PATCH | Yes | Needs Backend Verification |
| Remove Cart Item | `cart.service.js` → `removeCartItem()` | `useRemoveCartItem()` | `/cart/items/:id/` | DELETE | Yes | Needs Backend Verification |
| Clear Cart | `cart.service.js` → `clearCart()` | `useClearCart()` | `/cart/clear/` | POST | Yes | Needs Backend Verification |

| **Wishlist** | | | | | | |
| Get Wishlist | `wishlist.service.js` → `getWishlist()` | `useWishlist()` | `/wishlist/` | GET | Yes | Needs Backend Verification |
| Add to Wishlist | `wishlist.service.js` → `addWishlistItem()` | `useAddToWishlist()` | `/wishlist/items/` | POST | Yes | Needs Backend Verification |
| Remove Wishlist Item | `wishlist.service.js` → `removeWishlistItem()` | `useRemoveFromWishlist()` | `/wishlist/items/:id/` | DELETE | Yes | Needs Backend Verification |

| **Addresses** | | | | | | |
| List Addresses | `addresses.service.js` → `getAddresses()` | `useAddresses()` | `/addresses/` | GET | Yes | Needs Backend Verification |
| Create Address | `addresses.service.js` → `createAddress()` | — | `/addresses/` | POST | Yes | Needs Backend Verification |
| Update Address | `addresses.service.js` → `updateAddress()` | — | `/addresses/:id/` | PATCH | Yes | Needs Backend Verification |
| Delete Address | `addresses.service.js` → `deleteAddress()` | — | `/addresses/:id/` | DELETE | Yes | Needs Backend Verification |

| **Orders** | | | | | | |
| Create Order | `orders.service.js` → `createOrder()` | `useCreateOrder()` | `/orders/` | POST | Yes | Needs Backend Verification |
| List Orders | `orders.service.js` → `getOrders()` | — (OrderHistory) | `/orders/` | GET | Yes | Needs Backend Verification |
| Order Detail | `orders.service.js` → `getOrder()` | — (OrderDetails) | `/orders/:id/` | GET | Yes | Needs Backend Verification |

| **Payment (Placeholder)** | | | | | | |
| Stripe Payment | `stripe.service.js` | `usePayment()` | `/payments/stripe/create-intent/` | POST | Yes | **Pending** |
| SSLCommerz Payment | `sslcommerz.service.js` | `usePayment()` | `/payments/sslcommerz/init/` | POST | Yes | **Pending** |
| ShurjoPay Payment | `shurjopay.service.js` | `usePayment()` | `/payments/shurjopay/init/` | POST | Yes | **Pending** |
| bKash Payment | `bkash.service.js` | `usePayment()` | `/payments/bkash/init/` | POST | Yes | **Pending** |

| **Admin** | | | | | | |
| Dashboard Stats | — (inline) | — | `/admin/stats/` | GET | Yes (Admin) | Needs Backend Verification |
| List Products | — (inline) | — | `/admin/products/` | GET | Yes (Admin) | Needs Backend Verification |
| Create Product | — (inline) | — | `/admin/products/` | POST | Yes (Admin) | Needs Backend Verification |
| Get Product | — (inline) | — | `/admin/products/:id/` | GET | Yes (Admin) | Needs Backend Verification |
| Update Product | — (inline) | — | `/admin/products/:id/` | PATCH | Yes (Admin) | Needs Backend Verification |
| Delete Product | — (inline) | — | `/admin/products/:id/` | DELETE | Yes (Admin) | Needs Backend Verification |
| List Categories | — (inline) | — | `/admin/categories/` | GET | Yes (Admin) | Needs Backend Verification |
| Create Category | — (inline) | — | `/admin/categories/` | POST | Yes (Admin) | Needs Backend Verification |
| Get Category | — (inline) | — | `/admin/categories/:id/` | GET | Yes (Admin) | Needs Backend Verification |
| Update Category | — (inline) | — | `/admin/categories/:id/` | PATCH | Yes (Admin) | Needs Backend Verification |
| Delete Category | — (inline) | — | `/admin/categories/:id/` | DELETE | Yes (Admin) | Needs Backend Verification |
| List Orders | — (inline) | — | `/admin/orders/` | GET | Yes (Admin) | Needs Backend Verification |
| Delete Order | — (inline) | — | `/admin/orders/:id/` | DELETE | Yes (Admin) | Needs Backend Verification |
| List Stock | — (inline) | — | `/admin/stock/` | GET | Yes (Admin) | Needs Backend Verification |

> **Note**: Admin pages use inline `useQuery`/`useMutation` calls with `api.get/post/patch/delete` directly instead of separate service files, unlike feature pages which use dedicated service files + hooks.
