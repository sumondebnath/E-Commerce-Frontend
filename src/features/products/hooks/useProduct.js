import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../services/products.service'


export default function useProduct(id) {
  return useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id), enabled: !!id, staleTime: 1000 * 60 * 5 })
}
