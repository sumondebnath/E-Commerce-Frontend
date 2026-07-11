import { createContext, useEffect, useState, useCallback } from 'react';
import * as authService from './services/auth.service';
import {
  setAccessToken,
  clearAccessToken,
  setRefreshToken,
  clearRefreshToken,
  getRefreshToken,
} from '@/api/token';
import {
  requestRefresh,
  scheduleRefresh,
  resetRefreshManager,
  enableRefreshManager,
} from '@/api/refreshManager';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    try {
      const stored = getRefreshToken();
      if (stored) {
        enableRefreshManager();
        const access = await requestRefresh();
        if (access) {
          const profile = await authService.getProfile();
          setUser(profile);
          scheduleRefresh(access);
        }
      }
    } catch {
      // ignore network errors during bootstrap
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (credentials, remember = false) => {
    setAuthLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data.access) setAccessToken(data.access);
      if (data.refresh) setRefreshToken(data.refresh, remember);
      let userData;
      if (data.user) {
        setUser(data.user);
        userData = data.user;
      } else {
        const profile = await authService.getProfile();
        setUser(profile);
        userData = profile;
      }
      enableRefreshManager();
      scheduleRefresh(data.access);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  const register = async (payload, remember = false) => {
    setAuthLoading(true);
    try {
      const data = await authService.register(payload);
      if (data.access) setAccessToken(data.access);
      if (data.refresh) setRefreshToken(data.refresh, remember);
      let userData;
      if (data.user) {
        setUser(data.user);
        userData = data.user;
      } else {
        const profile = await authService.getProfile();
        setUser(profile);
        userData = profile;
      }
      enableRefreshManager();
      scheduleRefresh(data.access);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    resetRefreshManager();
    try {
      const stored = getRefreshToken();
      try {
        await authService.logout({ refresh: stored });
      } catch {
        // ignore remote errors
      }
      clearAccessToken();
      clearRefreshToken();
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    authLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
