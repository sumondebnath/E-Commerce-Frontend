import api from '@/api/axios';
import { PRODUCTS } from '@/api/endpoints';

export async function getProducts(params = {}) {
  const res = await api.get(PRODUCTS.LIST, { params });
  return res.data;
}

export async function getProduct(id) {
  const res = await api.get(PRODUCTS.DETAIL(id));
  return res.data;
}

export async function getRelatedProducts(categoryId, excludeId, params = {}) {
  const p = { ...params, category: categoryId, page_size: 4 };
  const res = await api.get(PRODUCTS.LIST, { params: p });
  const products = res.data?.results ?? [];
  return products.filter((p) => p.id !== excludeId);
}
