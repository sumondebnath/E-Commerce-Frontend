let accessToken = null;

const REFRESH_KEY = 'auth.refresh';
const REMEMBER_KEY = 'auth.remember';

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

// Refresh token is ALWAYS persisted so the session survives page reload.
// The "remember" flag only controls whether the session also survives browser close
// (handled by the backend's refresh-token expiry).
export function setRefreshToken(token, remember = true) {
  try {
    localStorage.setItem(REFRESH_KEY, token);
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, '1');
    }
  } catch {
    // ignore storage errors
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function clearRefreshToken() {
  try {
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* ignore */
  }
}

export function isRemembered() {
  try {
    return localStorage.getItem(REMEMBER_KEY) === '1';
  } catch {
    return false;
  }
}
