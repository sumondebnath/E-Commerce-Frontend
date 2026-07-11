import api from '@/api/axios';
import { ADDRESSES } from '@/api/endpoints';

export async function getAddresses() {
  const res = await api.get(ADDRESSES.LIST);
  return res.data?.results ?? [];
}

export async function createAddress(payload) {
  const res = await api.post(ADDRESSES.CREATE, payload);
  return res.data;
}

export async function updateAddress(id, payload) {
  const res = await api.patch(ADDRESSES.ITEM(id), payload);
  return res.data;
}

export async function deleteAddress(id) {
  const res = await api.delete(ADDRESSES.ITEM(id));
  return res.data;
}
