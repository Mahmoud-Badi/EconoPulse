import { useQuery } from '@tanstack/react-query'
import { commoditiesApi } from '../api/client'

export function useCommodities() {
  return useQuery({
    queryKey: ['commodities', 'quotes'],
    queryFn: commoditiesApi.getQuotes,
    staleTime: 300 * 1000,
  })
}
