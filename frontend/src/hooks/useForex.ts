import { useQuery } from '@tanstack/react-query'
import { forexApi } from '../api/client'

export function useForex() {
  return useQuery({
    queryKey: ['forex', 'rates'],
    queryFn: forexApi.getRates,
    staleTime: 120 * 1000,
  })
}
