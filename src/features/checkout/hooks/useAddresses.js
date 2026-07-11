import { useQuery } from '@tanstack/react-query'
import { getAddresses } from '../services/addresses.service'

export default function useAddresses() {
  return useQuery({ queryKey: ['addresses'], queryFn: getAddresses, staleTime: 1000 * 60 })
}
