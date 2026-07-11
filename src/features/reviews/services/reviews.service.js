import api from '@/api/axios';
import { REVIEWS } from '@/api/endpoints';

export async function getUserReviews(params = {}) {
  const res = await api.get(REVIEWS.ME, { params: { ...params, page_size: 100 } });
  return res.data?.results ?? [];
}
