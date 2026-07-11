import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrder, cancelOrder } from '../services/orders.service';

export function useOrders(params) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
    staleTime: 1000 * 60,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: (data) => {
      qc.setQueryData(['order', data.id], data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
