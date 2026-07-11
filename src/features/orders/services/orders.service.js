import api from '@/api/axios';
import { ORDERS } from '@/api/endpoints';

export async function getOrders(params = {}) {
  const res = await api.get(ORDERS.LIST, { params });
  return res.data;
}

export async function getOrder(id) {
  const res = await api.get(ORDERS.DETAIL(id));
  return res.data;
}

export async function cancelOrder(id) {
  const res = await api.post(ORDERS.CANCEL(id));
  return res.data;
}
