import api from '@/api/axios';
import { AUTH } from '@/api/endpoints';

export async function updateProfile(payload) {
  const res = await api.patch(AUTH.PROFILE, payload);
  return res.data;
}

export async function changePassword(payload) {
  const res = await api.post(AUTH.CHANGE_PASSWORD, payload);
  return res.data;
}
