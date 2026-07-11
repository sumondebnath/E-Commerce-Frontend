# Endpoint Checklist

## Authentication

- [ ] `POST /auth/login/` — Needs Backend Verification
- [ ] `POST /auth/register/` — Needs Backend Verification
- [ ] `POST /auth/refresh/` — Needs Backend Verification
- [ ] `POST /auth/logout/` — Needs Backend Verification
- [ ] `GET /auth/profile/` — Needs Backend Verification
- [ ] `PATCH /auth/profile/` — Needs Backend Verification
- [ ] `POST /auth/change-password/` — Needs Backend Verification

## Products

- [ ] `GET /products/` — Needs Backend Verification
- [ ] `GET /products/:id/` — Needs Backend Verification

## Categories

- [ ] `GET /categories/` — Needs Backend Verification

## Reviews

- [ ] `GET /products/:id/reviews/` — Needs Backend Verification
- [ ] `POST /products/:id/reviews/` — Needs Backend Verification
- [ ] `GET /reviews/` — Needs Backend Verification

## Cart

- [ ] `GET /cart/` — Needs Backend Verification
- [ ] `POST /cart/items/` — Needs Backend Verification
- [ ] `PATCH /cart/items/:id/` — Needs Backend Verification
- [ ] `DELETE /cart/items/:id/` — Needs Backend Verification
- [ ] `POST /cart/clear/` — Needs Backend Verification

## Wishlist

- [ ] `GET /wishlist/` — Needs Backend Verification
- [ ] `POST /wishlist/items/` — Needs Backend Verification
- [ ] `DELETE /wishlist/items/:id/` — Needs Backend Verification

## Addresses

- [ ] `GET /addresses/` — Needs Backend Verification
- [ ] `POST /addresses/` — Needs Backend Verification
- [ ] `PATCH /addresses/:id/` — Needs Backend Verification
- [ ] `DELETE /addresses/:id/` — Needs Backend Verification

## Orders (User)

- [ ] `POST /orders/` — Needs Backend Verification
- [ ] `GET /orders/` — Needs Backend Verification
- [ ] `GET /orders/:id/` — Needs Backend Verification

## Payment (Placeholder — Not Implemented)

- [ ] `POST /payments/stripe/create-intent/` — **Pending**
- [ ] `POST /payments/stripe/confirm/` — **Pending**
- [ ] `POST /payments/sslcommerz/init/` — **Pending**
- [ ] `POST /payments/sslcommerz/validate/` — **Pending**
- [ ] `POST /payments/shurjopay/init/` — **Pending**
- [ ] `POST /payments/shurjopay/verify/` — **Pending**
- [ ] `POST /payments/bkash/init/` — **Pending**
- [ ] `POST /payments/bkash/confirm/` — **Pending**

## Admin

- [ ] `GET /admin/stats/` — Needs Backend Verification
- [ ] `GET /admin/products/` — Needs Backend Verification
- [ ] `POST /admin/products/` — Needs Backend Verification
- [ ] `GET /admin/products/:id/` — Needs Backend Verification
- [ ] `PATCH /admin/products/:id/` — Needs Backend Verification
- [ ] `DELETE /admin/products/:id/` — Needs Backend Verification
- [ ] `GET /admin/categories/` — Needs Backend Verification
- [ ] `POST /admin/categories/` — Needs Backend Verification
- [ ] `GET /admin/categories/:id/` — Needs Backend Verification
- [ ] `PATCH /admin/categories/:id/` — Needs Backend Verification
- [ ] `DELETE /admin/categories/:id/` — Needs Backend Verification
- [ ] `GET /admin/orders/` — Needs Backend Verification
- [ ] `DELETE /admin/orders/:id/` — Needs Backend Verification
- [ ] `GET /admin/stock/` — Needs Backend Verification

## Summary

| Status | Count |
|--------|-------|
| Needs Backend Verification | 40 |
| Pending (Not Implemented) | 8 |
| Completed | 0 |
| **Total** | **48** |
