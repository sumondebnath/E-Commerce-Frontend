import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  isRemembered,
} from './token';
import { AUTH } from './endpoints';
import { getTokenExpiry } from '../common/utils/jwt';

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise = null;
let timerId = null;
let cancelled = false;

function doRefresh() {
  const stored = getRefreshToken();
  if (!stored) {
    throw new Error('no_refresh_token');
  }
  return refreshClient
    .post(AUTH.REFRESH, { refresh: stored })
    .then((res) => {
      if (cancelled) throw new Error('refresh_cancelled');
      const { access, refresh } = res.data;
      setAccessToken(access);
      if (refresh) {
        setRefreshToken(refresh, isRemembered());
      }
      return access;
    });
}

export function requestRefresh() {
  if (cancelled) return Promise.reject(new Error('refresh_cancelled'));
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh()
    .catch((err) => {
      clearAccessToken();
      throw err;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function scheduleRefresh(access) {
  cancelTimer();
  if (!access) return;
  const exp = getTokenExpiry(access);
  if (!exp) return;
  const ms = exp - Date.now() - 60_000;
  if (ms <= 0) return;
  timerId = setTimeout(() => {
    requestRefresh().catch(() => {});
  }, ms);
}

export function cancelTimer() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

export function resetRefreshManager() {
  cancelled = true;
  cancelTimer();
  refreshPromise = null;
}

export function enableRefreshManager() {
  cancelled = false;
}
