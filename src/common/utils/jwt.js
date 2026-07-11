export function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function getTokenExpiry(token) {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return null;
  return decoded.exp * 1000;
}
