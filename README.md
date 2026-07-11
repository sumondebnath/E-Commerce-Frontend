<div align="center">

# Shop — E-Commerce Frontend

A production-ready, dual-portal e-commerce frontend built with React 19, featuring a **Customer Storefront** and a separate **Admin Dashboard** with role-based access control.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter)](https://reactrouter.com)
[![React Query](https://img.shields.io/badge/React_Query-5-FF4154?logo=tanstack)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
- [Production Build](#production-build)
- [Authentication Flow](#authentication-flow)
- [Project Architecture](#project-architecture)
- [API Structure](#api-structure)
- [Customer Features](#customer-features)
- [Admin Features](#admin-features)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
  - [Netlify (Frontend)](#netlify-frontend)
  - [Backend Deployment](#backend-deployment)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This is a **single-page application** that serves two distinct user experiences from one codebase:

- **Customer Storefront** (`/`) — A polished shopping experience with product browsing, cart management, wishlist, checkout, order tracking, and user profile management.
- **Admin Dashboard** (`/admin`) — A management portal for products, categories, orders, stock, and a real-time dashboard with sales statistics.

Both portals share the same API layer but have **separate authentication flows, layouts, and route guards**. The frontend communicates with a [Django REST Framework](https://www.django-rest-framework.org/) backend via a RESTful API.

---

## Features

### Customer Storefront

- Product browsing with search, category filters, and sorting
- Product detail pages with reviews, ratings, and recommendations
- Shopping cart with quantity management and real-time totals
- Wishlist / watchlist functionality
- Multi-step checkout with address management
- Order history and order detail tracking
- User profile, password change, and address book
- JWT authentication with automatic token refresh

### Admin Dashboard

- Real-time dashboard with sales statistics
- CRUD operations for products, categories, and stock management
- Order management with status updates
- Image upload support for products
- Separate admin login with role-based access control
- Countdown-based unauthorized access redirect

### Technical

- Lazy-loaded routes for optimal code-splitting (55+ chunks)
- Single refresh token manager that prevents race conditions
- Safe request retry — only safe methods (GET/HEAD) are retried after refresh
- React Compiler (babel plugin) for automatic memoization
- Full accessibility (ARIA labels, focus management, screen reader support)
- SEO-optimized with structured data (JSON-LD), meta tags, and sitemap
- Form validation with Zod schemas and React Hook Form

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **State Management** | TanStack React Query 5 |
| **Forms** | React Hook Form 7 + Zod 3 |
| **HTTP Client** | Axios 1 |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Compiler** | React Compiler (Babel plugin) |
| **Code Quality** | ESLint 10 + Prettier |

---

## Folder Structure

```
src/
├── admin/                    # Admin portal
│   ├── AdminLayout.jsx       # Admin shell (sidebar, topbar, breadcrumbs)
│   ├── components/           # Admin-specific components
│   │   └── AdminLoginForm.jsx
│   ├── pages/                # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminProductForm.jsx
│   │   ├── AdminCategories.jsx
│   │   ├── AdminCategoryForm.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminOrderDetail.jsx
│   │   ├── AdminStock.jsx
│   │   ├── AdminLoginPage.jsx
│   │   └── AdminUnauthorized.jsx
│   └── services/
│       └── admin.service.js
├── api/                      # API layer
│   ├── axios.js              # Axios instance with interceptors
│   ├── endpoints.js          # All API endpoint constants
│   ├── token.js              # Token storage (memory + localStorage)
│   └── refreshManager.js     # Single refresh token manager
├── app/
│   └── AppRoutes.jsx         # Route definitions (customer + admin)
├── common/                   # Shared components and utilities
│   ├── auth/                 # Route guards
│   │   ├── AdminRoute.jsx
│   │   ├── RequireAuth.jsx
│   │   ├── RequireGuest.jsx
│   │   └── getUserRoles.js
│   ├── components/           # Reusable UI components
│   │   ├── ConfirmDialog.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Table.jsx
│   │   └── UI/
│   │       ├── ConfirmDialog.jsx
│   │       ├── Input.jsx
│   │       ├── Skeleton.jsx
│   │       └── Textarea.jsx
│   ├── hooks/                # Shared hooks
│   │   └── useDocumentTitle.js
│   ├── layout/               # Layout wrappers
│   │   ├── MainLayout.jsx    # Customer layout (header + footer + cart drawer)
│   │   └── AuthLayout.jsx    # Auth pages layout
│   └── utils/                # Utility functions
├── config/
│   └── env.js                # Environment variable helpers
├── features/                 # Feature modules (domain-driven)
│   ├── auth/                 # Authentication (login, register, profile)
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout flow + addresses
│   ├── orders/               # Order history + details
│   ├── products/             # Product listing + detail + reviews
│   ├── profile/              # User profile management
│   ├── reviews/              # Review management
│   └── wishlist/             # Wishlist / watchlist
├── pages/                    # Top-level pages
│   ├── Home.jsx
│   ├── NotFound.jsx
│   └── Unauthorized.jsx
├── App.jsx                   # Root component
├── main.jsx                  # Entry point
└── index.css                 # Global styles + Tailwind
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A running backend API (see [Backend Deployment](#backend-deployment))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/e-commerce-frontend.git
cd e-commerce-frontend

# Install dependencies
npm install
```

### Environment Variables

Copy the example env file and configure it:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `""` (empty) | Backend API base URL. Leave empty in dev to use Vite proxy. Set in production. |

```bash
# .env (development — Vite proxy handles /api/*)
VITE_API_BASE_URL=

# .env (production)
VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

> **Note:** In development, the Vite dev server proxies `/api/*` requests to the backend URL configured in `vite.config.js`. No CORS issues in dev.

---

## Development

```bash
# Start the dev server (http://localhost:5173)
npm run dev

# Lint the codebase
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

The dev server runs at `http://localhost:5173` with hot module replacement (HMR).

---

## Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The build output is in `dist/` with optimized code-splitting:

| Chunk | Size (gzip) |
|-------|-------------|
| `vendor` (React, Router, Query) | ~137 KB |
| `app` (core app code) | ~5 KB |
| Lazy chunks (55+) | 0.5–3 KB each |

---

## Authentication Flow

The app uses **JWT (JSON Web Token)** authentication with short-lived access tokens and long-lived refresh tokens.

```
┌─────────────┐     POST /api/accounts/login/     ┌──────────┐
│  Login Form │ ─────────────────────────────────▶ │  Backend │
│             │ ◀───────────────────────────────── │          │
└─────────────┘   { access, refresh, user }        └──────────┘
      │
      ▼
┌──────────────┐    Store refresh in localStorage
│  Token Store │    Keep access token in memory only
└──────────────┘
      │
      ▼  On every API request
┌──────────────┐    Attach Authorization: Bearer <access>
│  Axios       │ ──────────────────────────────────▶ Backend
│  Interceptor │ ◀────────────────────────────────── Response
└──────────────┘
      │
      ▼  On 401 response
┌──────────────┐    POST /api/accounts/login/refresh/
│  Refresh     │ ──────────────────────────────────▶ Backend
│  Manager     │ ◀────────────────────────────────── New access token
└──────────────┘
      │
      ▼  Retry original request (GET/HEAD only)
      ▼  Reject mutations (POST/PUT/PATCH/DELETE)
```

### Key Design Decisions

- **Access token in memory only** — Not vulnerable to XSS via `document.cookie`
- **Refresh token in `localStorage`** — Persists across sessions, survives page reloads
- **Single refresh manager** — Deduplicates concurrent refresh requests, queues pending requests, prevents race conditions
- **Safe retry only** — Only GET/HEAD/OPTIONS requests are automatically retried after refresh. Mutations (POST/PUT/PATCH/DELETE) are rejected to prevent duplicate orders or cart additions

---

## Project Architecture

### Dual-Portal Design

```
┌─────────────────────────────────────────────────┐
│                  BrowserRouter                   │
├──────────────────────┬──────────────────────────┤
│   Customer Portal    │     Admin Portal         │
│   (MainLayout)       │     (AdminLayout)        │
├──────────────────────┼──────────────────────────┤
│   RequireGuest       │     AdminRoute           │
│   RequireAuth        │     (role-based guard)   │
├──────────────────────┼──────────────────────────┤
│   /auth/login        │     /admin/login         │
│   /products          │     /admin/products      │
│   /cart              │     /admin/categories    │
│   /checkout          │     /admin/orders        │
│   /profile/*         │     /admin/stock         │
│   /wishlist          │     /admin (dashboard)   │
└──────────────────────┴──────────────────────────┘
```

### Route Protection

| Guard | Purpose | Behavior |
|-------|---------|----------|
| `RequireAuth` | Protects authenticated routes | Redirects to `/auth/login` with redirect-back state |
| `RequireGuest` | Prevents authenticated users from login/register | Redirects to `/` |
| `AdminRoute` | Protects admin routes | Checks user roles, shows countdown + redirect for non-admins |

### State Management

- **Server state** — Managed by React Query (caching, refetching, optimistic updates)
- **Form state** — Managed by React Hook Form + Zod validation
- **UI state** — Local `useState` (drawers, modals, filters)
- **Auth state** — React Context (`AuthProvider`) with token management

---

## API Structure

All endpoints are defined in `src/api/endpoints.js`.

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | `POST /api/accounts/login/`, `POST /api/accounts/register/`, `POST /api/accounts/login/refresh/`, `POST /api/accounts/logout/` | Authentication & token management |
| **Profile** | `GET/PUT /api/accounts/profile/`, `POST /api/accounts/change-password/` | User profile management |
| **Addresses** | `GET/POST /api/accounts/addresses/`, `DELETE /api/accounts/addresses/:id/` | Address book |
| **Products** | `GET /api/products/`, `GET /api/products/:id/` | Product listing & detail |
| **Categories** | `GET /api/products/categories/`, `GET /api/products/categories/:slug/` | Category listing |
| **Reviews** | `GET/POST /api/products/reviews/` | Product reviews |
| **Wishlist** | `GET/POST /api/products/watchlist/`, `DELETE /api/products/watchlist/:id/` | Wishlist management |
| **Cart** | `GET/POST /api/cart/`, `DELETE /api/cart/:id/`, `POST /api/cart/clear/`, `GET /api/cart/summary/` | Shopping cart |
| **Orders** | `GET /api/orders/`, `POST /api/orders/checkout/`, `GET /api/orders/:id/`, `POST /api/orders/:id/cancel/` | Order management |
| **Admin** | `GET /api/admin/dashboard/`, CRUD on `/api/admin/products/`, `/api/admin/categories/`, `/api/admin/orders/`, `/api/admin/products/:id/stock/` | Admin operations |

---

## Customer Features

| Feature | Route | Description |
|---------|-------|-------------|
| Home | `/` | Landing page with hero, featured products, categories |
| Products | `/products` | Product grid with search, category filters, sort |
| Product Detail | `/products/:id` | Full product page with images, reviews, add-to-cart |
| Cart | `/cart` | Cart with quantity controls, clear, and checkout link |
| Wishlist | `/wishlist` | Saved products for later |
| Checkout | `/checkout` | Multi-step checkout with address selection |
| Order Success | `/checkout/success` | Post-checkout confirmation |
| Profile | `/profile` | User profile overview |
| Edit Profile | `/profile/edit` | Update name, email |
| Addresses | `/profile/addresses` | Manage shipping addresses |
| Change Password | `/profile/password` | Update password |
| Order History | `/profile/orders` | List of past orders |
| Order Detail | `/profile/orders/:id` | Single order with items and status |
| Reviews | `/profile/reviews` | Manage your product reviews |

---

## Admin Features

| Feature | Route | Description |
|---------|-------|-------------|
| Login | `/admin/login` | Admin-specific login page |
| Dashboard | `/admin` | Sales stats, order count, revenue overview |
| Products | `/admin/products` | Product list with search and pagination |
| Add Product | `/admin/products/new` | Create product with image upload |
| Edit Product | `/admin/products/:id/edit` | Update product details |
| Categories | `/admin/categories` | Category list with CRUD |
| Add Category | `/admin/categories/new` | Create category with slug |
| Edit Category | `/admin/categories/:id/edit` | Update category |
| Orders | `/admin/orders` | Order list with status filters |
| Order Detail | `/admin/orders/:id` | View and update order status |
| Stock | `/admin/stock` | Inventory management with inline adjustments |

---

## Screenshots

<!-- Replace with actual screenshots -->

| Customer Storefront | Admin Dashboard |
|---------------------|-----------------|
| ![Customer Home](docs/screenshots/customer-home.png) | ![Admin Dashboard](docs/screenshots/admin-dashboard.png) |
| ![Product Page](docs/screenshots/product-page.png) | ![Admin Products](docs/screenshots/admin-products.png) |
| ![Cart](docs/screenshots/cart.png) | ![Admin Orders](docs/screenshots/admin-orders.png) |
| ![Checkout](docs/screenshots/checkout.png) | ![Admin Stock](docs/screenshots/admin-stock.png) |

---

## Deployment

### Netlify (Frontend)

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com) → **New site from Git**
3. Select your repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` (in environment variables: `NODE_VERSION=18`) |

5. Set environment variables in Netlify dashboard:

```
VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

6. Add a `_redirects` file in `public/` for SPA routing:

```
/*    /index.html   200
```

Or configure via `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend Deployment

The frontend connects to a Django REST Framework backend. The backend must be deployed and accessible.

**Backend requirements:**

- Django 4+ with Django REST Framework
- `ROTATE_REFRESH_TOKENS=True`
- `BLACKLIST_AFTER_ROTATION=True`
- `ACCESS_TOKEN_LIFETIME=15 minutes`
- `REFRESH_TOKEN_LIFETIME=7 days`
- CORS configured to allow the frontend domain

**Quick deploy to Render:**

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your backend repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn your_project.wsgi:application`
5. Set environment variables (DATABASE_URL, SECRET_KEY, etc.)

---

## Troubleshooting

### `npm run dev` fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors in development

The Vite dev server proxies `/api/*` to the backend. If you still see CORS errors:

1. Check `vite.config.js` → `server.proxy.target` matches your backend URL
2. Ensure your backend has CORS configured for `http://localhost:5173`

### API requests return 404 in development

- The Vite proxy only forwards `/api/*` requests
- Check that `VITE_API_BASE_URL` is **empty** in your `.env` file for development

### Token refresh loops

If you see repeated 401 errors or the app logs you out unexpectedly:

1. Ensure your backend has `ROTATE_REFRESH_TOKENS=True`
2. Check that refresh tokens are not blacklisted on first use
3. Clear `localStorage` and log in again

### Build fails with memory errors

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Images not loading

- Product images must be served as full URLs from the backend (`image_url` field)
- Check that the backend returns `image_url` as an absolute URL (e.g., `https://...`)

### Admin access denied

- The user must have an `admin` role in the backend
- `getUserRoles()` checks: `user.roles`, `user.role`, `user.user_type`, `user.type`, `user.group`, `user.groups`, `user.is_superuser`, `user.is_admin`, `user.is_staff`
- Non-admin users see a countdown and are redirected to `/`

---

## Future Improvements

- [ ] **Payment integration** — Stripe / PayPal checkout
- [ ] **Real-time notifications** — WebSocket support for order updates
- [ ] **Image optimization** — CDN-backed responsive images with `srcset`
- [ ] **PWA support** — Service worker, offline cart, install prompt
- [ ] **Multi-language** — i18n with `react-i18next`
- [ ] **Dark mode** — System preference detection + toggle
- [ ] **Product comparison** — Side-by-side product comparison
- [ ] **Advanced search** — Faceted search with filters, price range, ratings
- [ ] **Email templates** — Order confirmation, shipping notifications
- [ ] **Analytics** — Page views, conversion tracking
- [ ] **E2E testing** — Playwright or Cypress test suite
- [ ] **Performance monitoring** — Lighthouse CI, Web Vitals tracking
- [ ] **GraphQL API** — Migrate from REST to GraphQL for flexible queries
- [ ] **Inventory alerts** — Low stock notifications for admins
- [ ] **Bulk operations** — CSV import/export for products

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use functional components with hooks
- Follow the existing folder structure (`features/`, `common/`, `admin/`)
- Use React Query for server state, not local state
- Use Zod schemas for form validation
- Run `npm run lint` and `npm run format` before committing
- Write meaningful commit messages

### Commit Convention

```
feat: add product comparison feature
fix: resolve cart quantity update race condition
refactor: extract refresh manager into separate module
docs: update README with deployment instructions
```

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Built with React 19 + Vite 8 + Tailwind CSS 4

</div>
