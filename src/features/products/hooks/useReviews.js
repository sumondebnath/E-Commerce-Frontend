import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReviews, createReview } from '../services/reviews.service'

export function useReviews(productId) {
  return useQuery({
    queryKey: ['product', productId, 'reviews'],
    queryFn: () => getReviews(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateReview(productId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createReview(productId, payload),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['product', productId, 'reviews'] });
      qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
