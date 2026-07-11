import api from '@/api/axios';
import { ORDERS } from '@/api/endpoints';

export async function createOrder(payload) {
  const res = await api.post(ORDERS.CHECKOUT, payload);
  return res.data;
}
