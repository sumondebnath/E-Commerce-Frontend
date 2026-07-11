import { useQuery } from '@tanstack/react-query'
import { getCart, getCartSummary } from '../services/cart.service'
import useAuth from '@/features/auth/useAuth'

export default function useCart(opts = {}) {
  const { isAuthenticated } = useAuth()
  return useQuery({ queryKey: ['cart'], queryFn: getCart, staleTime: 1000 * 60, enabled: isAuthenticated, ...opts })
}

export function useCartSummary() {
  const { isAuthenticated } = useAuth();
  return useQuery({ queryKey: ['cart-summary'], queryFn: getCartSummary, staleTime: 1000 * 60, enabled: isAuthenticated });
}
