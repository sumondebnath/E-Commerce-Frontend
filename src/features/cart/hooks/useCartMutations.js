import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as service from '../services/cart.service';

function recalcTotal(items) {
  return items.reduce((sum, it) => sum + Number(it.subtotal || 0), 0);
}

function getCartErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return 'Something went wrong';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (data.quantity) return data.quantity;
  if (data.non_field_errors) return data.non_field_errors;
  if (Array.isArray(data)) return data[0];
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return Array.isArray(val) ? val[0] : val;
  }
  return 'Something went wrong';
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => service.addCartItem(payload),
    onSuccess: (item) => {
      qc.setQueryData(['cart'], (old) => {
        const items = old ? [...old.items, item] : [item];
        return { items, total: recalcTotal(items) };
      });
    },
    onError: (err) => toast.error(getCartErrorMessage(err)),
    onSettled: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => service.updateCartItem(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: ['cart'] });
      const previous = qc.getQueryData(['cart']);
      qc.setQueryData(['cart'], (old) => {
        if (!old) return old;
        const items = old.items.map((it) => (it.id === id ? { ...it, ...payload } : it));
        return { items, total: recalcTotal(items) };
      });
      return { previous };
    },
    onError: (err, vars, context) => {
      qc.setQueryData(['cart'], context.previous);
      toast.error(getCartErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => service.removeCartItem(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['cart'] });
      const previous = qc.getQueryData(['cart']);
      qc.setQueryData(['cart'], (old) => {
        if (!old) return old;
        const items = old.items.filter((it) => it.id !== id);
        return { items, total: recalcTotal(items) };
      });
      return { previous };
    },
    onError: (err, id, context) => {
      qc.setQueryData(['cart'], context.previous);
      toast.error(getCartErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => service.clearCart(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['cart'] });
      const previous = qc.getQueryData(['cart']);
      qc.setQueryData(['cart'], { items: [], total: 0 });
      return { previous };
    },
    onError: (err, vars, context) => {
      qc.setQueryData(['cart'], context.previous);
      toast.error(getCartErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}
