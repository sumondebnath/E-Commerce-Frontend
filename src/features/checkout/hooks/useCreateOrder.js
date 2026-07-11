import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../services/orders.service';

export default function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
