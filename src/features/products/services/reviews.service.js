import api from '@/api/axios';
import { REVIEWS } from '@/api/endpoints';

export async function getReviews(productId) {
  const res = await api.get(REVIEWS.LIST, { params: { product: productId } });
  return res.data?.results ?? [];
}

export async function createReview(productId, payload) {
  const res = await api.post(REVIEWS.CREATE, { ...payload, product: productId });
  return res.data;
}
