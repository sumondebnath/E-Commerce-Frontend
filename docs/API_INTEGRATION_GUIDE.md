# API Integration Guide

## Project Architecture

```
src/
├── api/
│   ├── axios.js          # Axios instance with interceptors, token refresh
│   ├── endpoints.js      # All backend endpoint URL constants
│   └── token.js          # JWT token storage (in-memory access, localStorage refresh)
├── features/
│   └── <feature>/
│       ├── services/     # Raw Axios API calls
│       ├── hooks/        # React Query wrappers (queries & mutations)
│       ├── components/   # UI components consuming hooks
│       ├── pages/        # Route-level page components
│       └── context/      # React Context providers (auth, payment)
├── common/
│   ├── auth/             # Route guards (RequireAuth, RequireGuest, RequireRole)
│   └── hooks/            # Shared hooks (useDocumentTitle)
├── admin/
│   └── pages/            # Admin dashboard pages
└── app/
    ├── AppRoutes.jsx     # All routes (lazy-loaded)
    └── providers/        # Global providers (Query, Auth, Toast)
```

## Axios Instance (`src/api/axios.js`)

- Base URL from `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:8000`)
- Request interceptor attaches `Authorization: Bearer <access_token>` header
- Response interceptor handles 401 errors with automatic token refresh
- Failed requests are queued during token refresh and retried after refresh succeeds

## React Query Flow

```
Page Component
  ↓ imports
Hook (e.g. useProducts)
  ↓ calls
Service function (e.g. getProducts)
  ↓ calls
Axios instance (api.get/post/patch/delete)
  ↓ calls
Backend endpoint (e.g. GET /products/)
  ↓ returns
Response data
  ↓ cached by
React Query cache (queryKey)
  ↓ renders
Page Component with data
```

## Service Layer

Each feature has a service file under `src/features/<feature>/services/`. Service functions:
- Accept typed parameters
- Call `api` (the Axios instance) with the correct HTTP method and endpoint
- Return `res.data` from the Axios response

## Hooks

Each feature has hooks under `src/features/<feature>/hooks/` that wrap service calls with React Query.

### Query Pattern
```js
export default function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
}
```

### Mutation Pattern
```js
export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => service.addCartItem(payload),
    onMutate: async (newItem) => {
      await qc.cancelQueries(['cart']);
      const previous = qc.getQueryData(['cart']);
      qc.setQueryData(['cart'], (old) => ({
        ...old,
        items: [newItem, ...(old?.items || [])],
      }));
      return { previous };
    },
    onError: (err, vars, context) => qc.setQueryData(['cart'], context.previous),
    onSettled: () => qc.invalidateQueries(['cart']),
  });
}
```

## Authentication Flow

1. **Bootstrap**: On app load, `AuthProvider` checks for stored refresh token.
2. **Token Refresh**: If a refresh token exists, attempt to get a new access token.
3. **Profile Fetch**: If refresh succeeds, fetch user profile via `GET /auth/profile/`.
4. **Login**: `login()` in `AuthProvider` → `auth.service.login()` → `POST /auth/login/` → stores access + refresh tokens → fetches profile.
5. **Register**: `register()` in `AuthProvider` → `auth.service.register()` → `POST /auth/register/` → stores tokens → fetches profile.
6. **Logout**: `logout()` in `AuthProvider` → `auth.service.logout()` → clears all tokens.
7. **Auto-refresh**: Access token refreshed 60 seconds before expiry via `scheduleRefresh`.

## Token Refresh

- Access token stored in-memory (`accessToken` variable in `token.js`)
- Refresh token stored in `localStorage` under `auth.refresh` key
- Token refresh is triggered by 401 responses from any API call
- The interceptor queues concurrent 401 requests and processes them after a single refresh call
- Refresh endpoint: `POST /auth/refresh/` with `{ refresh }` body

## Error Handling

- **Network errors**: `cart.service.js` catches network errors gracefully (returns empty cart)
- **API errors**: Caught by mutation `onError` callbacks, displayed via Sonner toasts
- **React Query**: `onError` callbacks roll back optimistic updates when mutations fail
- **Global boundary**: `ErrorBoundary` wrapped around `AppRoutes` at `App.jsx`
- **Auth errors**: `LoginForm` and `RegisterForm` parse `error.response.data` for field-level errors

## Query Key Conventions

| Query | Key Pattern |
|-------|-------------|
| Products list | `['products', params]` |
| Single product | `['product', id]` |
| Product reviews | `['product', productId, 'reviews']` |
| Cart | `['cart']` |
| Wishlist | `['wishlist']` |
| Categories | `['categories']` |
| Addresses | `['addresses']` |
| Orders | `['orders']` |
| Single order | `['order', id]` |
| User reviews | `['my-reviews']` |
| Admin products | `['admin-products', query]` |
| Admin categories | `['admin-categories', query]` |
| Admin orders | `['admin-orders', filters]` |
| Admin stock | `['admin-stock', query]` |
| Admin stats | `['admin-stats']` |

## How to Integrate New Endpoints

1. Add endpoint URL constant to `src/api/endpoints.js`
2. Create service function in the feature's service file
3. Create query/mutation hook in the feature's hooks directory
4. Use the hook in the page/component
5. Add query key pattern to this guide
