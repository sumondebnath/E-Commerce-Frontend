# Authentication Flow

## Overview

The authentication system uses JWT tokens (access + refresh) with the following architecture:

- **Access token**: Stored in-memory, short-lived, sent as Bearer token
- **Refresh token**: Stored in localStorage (only if "remember me" checked), long-lived
- **Token refresh**: Automatic via Axios interceptor and scheduled timer

## Flow Diagram

```
App Loads
  ↓
AuthProvider.bootstrap()
  ├─ Check localStorage for refresh token
  ├─ If found → POST /auth/refresh/ → get new access token
  ├─ If refresh succeeds → GET /auth/profile/ → set user state
  └─ If refresh fails → clear all tokens, user stays null
  ↓
App renders routes
  ├─ RequireAuth → if !user → redirect /auth/login
  ├─ RequireGuest → if user → redirect /
  └─ RequireRole → check user.roles for required role
```

## Token Refresh Mechanism

### Scheduled Refresh (Proactive)

In `AuthProvider`, after successful login or token refresh:
1. Decode access token JWT to get expiry timestamp
2. Schedule a refresh 60 seconds before expiry
3. When timer fires, call `POST /auth/refresh/` with stored refresh token
4. Store new access token, schedule next refresh

### Interceptor Refresh (Reactive)

In `src/api/axios.js`:
1. Any API call returns 401
2. Check if refresh is already in progress (`isRefreshing` flag)
3. If refreshing, queue the failed request
4. If not refreshing, set `_retry` flag, call `POST /auth/refresh/`
5. Get new access token, retry all queued requests
6. If refresh fails, clear all tokens, reject all queued requests

## Login Flow

```
LoginForm.onSubmit()
  ↓
AuthProvider.login(credentials, remember)
  ↓
auth.service.login(credentials) → POST /auth/login/ { email, password }
  ↓
On success: { access, refresh?, user? }
  ├─ Store access token (in-memory)
  ├─ Store refresh token (localStorage if remember=true)
  ├─ If user in response → set user state directly
  ├─ If no user → GET /auth/profile/ → set user state
  └─ Schedule proactive token refresh
  ↓
React Query cache invalidated (if applicable)
  ↓
Navigate to home or previous page
```

## Register Flow

```
RegisterForm.onSubmit()
  ↓
AuthProvider.register(payload, remember)
  ↓
auth.service.register(payload) → POST /auth/register/ { email, password, name }
  ↓
On success: { access, refresh?, user? }
  ├─ Store tokens
  ├─ GET /auth/profile/ → set user state
  └─ Schedule token refresh
```

## Logout Flow

```
User clicks logout
  ↓
AuthProvider.logout()
  ├─ POST /auth/logout/ (best-effort, ignores errors)
  ├─ clearAccessToken()
  ├─ clearRefreshToken()
  └─ setUser(null)
  ↓
React Query cache cleared
  ↓
Redirect to home/login
```

## Route Guards

### RequireAuth (`src/common/auth/RequireAuth.jsx`)
- If `loading` → render nothing (prevents flash redirect)
- If `isAuthenticated` → render `<Outlet />`
- If not authenticated → `<Navigate to="/auth/login" />`

### RequireGuest (`src/common/auth/RequireGuest.jsx`)
- If `loading` → render nothing
- If not authenticated → render `<Outlet />`
- If authenticated → `<Navigate to="/" />`

### RequireRole (`src/common/auth/RequireRole.jsx`)
- If `loading` → render nothing
- If no user → `<Navigate to="/auth/login" />`
- Check `user.roles` or `user.role` for the required role
- If has role → render `<Outlet />`
- If missing role → `<Navigate to="/unauthorized" />`

## Known Issues / Needs Backend Verification

1. **Login response shape**: The code expects `{ access, refresh, user }`. Backend may return different field names (e.g., `access_token` instead of `access`).

2. **Register response shape**: Same assumptions as login.

3. **Logout endpoint**: `POST /auth/logout/` may require a request body (e.g., `{ refresh }`).

4. **Profile response**: `GET /auth/profile/` returns user object. Field names need verification (e.g., `name` vs `username`).

5. **Role field**: `RequireRole` checks `user.roles` (array) or `user.role` (string). Backend field name and format need verification.

6. **Token endpoint**: `POST /auth/refresh/` may work differently (e.g., returning `{ access_token }` vs `{ access }`).

7. **Password change**: Request/response format at `/auth/change-password/` needs verification.

8. **Profile update**: `PATCH /auth/profile/` may support different fields than what `EditProfile` sends.
