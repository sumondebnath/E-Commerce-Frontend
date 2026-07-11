import api from '@/api/axios';
import { AUTH } from '@/api/endpoints';

export async function login(credentials) {
  const res = await api.post(AUTH.LOGIN, credentials);
  return res.data;
}

export async function register(payload) {
  const res = await api.post(AUTH.REGISTER, payload);
  return res.data;
}

export async function refresh(payload) {
  const res = await api.post(AUTH.REFRESH, payload);
  return res.data;
}

export async function logout(payload) {
  const res = await api.post(AUTH.LOGOUT, payload);
  return res.data;
}

export async function getProfile() {
  const res = await api.get(AUTH.PROFILE);
  return res.data;
}
