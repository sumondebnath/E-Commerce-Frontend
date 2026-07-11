import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as service from '../services/wishlist.service';
import useAuth from '@/features/auth/useAuth';

function getErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return 'Something went wrong';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (data.non_field_errors) return data.non_field_errors;
  if (Array.isArray(data)) return data[0];
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return Array.isArray(val) ? val[0] : val;
  }
  return 'Something went wrong';
}

export default function useWishlist() {
  const { isAuthenticated } = useAuth();
  return useQuery({ queryKey: ['wishlist'], queryFn: service.getWishlist, staleTime: 1000 * 60, enabled: isAuthenticated });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => service.addWishlistItem(payload),
    onSuccess: (data) => {
      qc.setQueryData(['wishlist'], (old) => ({
        items: [data, ...(old?.items || [])],
      }));
    },
    onError: (err) => toast.error(getErrorMessage(err)),
    onSettled: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => service.removeWishlistItem(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['wishlist'] });
      const previous = qc.getQueryData(['wishlist']);
      qc.setQueryData(['wishlist'], (old) => ({
        items: (old?.items || []).filter((it) => it.id !== id),
      }));
      return { previous };
    },
    onError: (err, id, context) => {
      qc.setQueryData(['wishlist'], context.previous);
      toast.error(getErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });
}
