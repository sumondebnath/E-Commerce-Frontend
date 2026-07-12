import axios from 'axios';
import { VITE_API_BASE_URL } from '../config/env';
import { getAccessToken, getRefreshToken, clearAccessToken } from './token';
import { AUTH } from './endpoints';
import { requestRefresh } from './refreshManager';

const isSameOrigin = VITE_API_BASE_URL.startsWith(window.location.origin);

const axiosInstance = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: isSameOrigin,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !config.url.includes(AUTH.REFRESH)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let retryQueue = [];
let isRetrying = false;

const processRetryQueue = (error, token = null) => {
  retryQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  retryQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response ? error.response.status : null;
    const url = originalRequest.url || '';

    if (status === 401 && !originalRequest._retry && !url.includes(AUTH.REFRESH)) {
      if (!getRefreshToken()) {
        clearAccessToken();
        return Promise.reject(error);
      }

      const isSafeMethod = ['get', 'head', 'options'].includes(
        (originalRequest.method || 'get').toLowerCase()
      );

      if (isRetrying) {
        return new Promise((resolve, reject) => {
          retryQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRetrying = true;
      originalRequest._retry = true;

      try {
        const newToken = await requestRefresh();
        processRetryQueue(null, newToken);
        if (!isSafeMethod) {
          return Promise.reject(error);
        }
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processRetryQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRetrying = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
