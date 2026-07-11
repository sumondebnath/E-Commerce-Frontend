import api from '@/api/axios';
import { WISHLIST } from '@/api/endpoints';

export async function getWishlist() {
  const res = await api.get(WISHLIST.LIST);
  return { items: res.data?.results ?? [] };
}

export async function addWishlistItem(payload) {
  const res = await api.post(WISHLIST.ADD, payload);
  return res.data;
}

export async function removeWishlistItem(itemId) {
  const res = await api.delete(WISHLIST.ITEM(itemId));
  return res.data;
}
