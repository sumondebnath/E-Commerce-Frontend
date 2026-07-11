import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getProducts } from '../services/products.service'

export default function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  })
}
