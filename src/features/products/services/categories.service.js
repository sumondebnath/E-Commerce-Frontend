import api from '@/api/axios';
import { CATEGORIES } from '@/api/endpoints';

export async function getCategories() {
  const res = await api.get(CATEGORIES.LIST);
  return res.data?.results ?? [];
}
