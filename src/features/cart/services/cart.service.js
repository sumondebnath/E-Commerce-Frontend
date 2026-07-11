import api from '@/api/axios';
import { CART } from '@/api/endpoints';

const mapItem = (item) => ({
  id: item.id,
  product: item.product,
  product_name: item.product_name,
  product_price: item.product_price,
  product_image: item.product_image,
  image_url: item.image_url,
  quantity: item.quantity,
  subtotal: item.subtotal,
  stock_available: item.stock_available,
});

export async function getCart() {
  const res = await api.get(CART.LIST);
  const items = (res.data?.results ?? []).map(mapItem);
  const total = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  return { items, total };
}

export async function getCartSummary() {
  const res = await api.get(CART.SUMMARY);
  return res.data;
}

export async function addCartItem(payload) {
  const res = await api.post(CART.ADD, payload);
  return mapItem(res.data);
}

export async function updateCartItem(itemId, payload) {
  const res = await api.patch(CART.ITEM(itemId), payload);
  return mapItem(res.data);
}

export async function removeCartItem(itemId) {
  await api.delete(CART.ITEM(itemId));
}

export async function clearCart() {
  await api.post(CART.CLEAR);
}
