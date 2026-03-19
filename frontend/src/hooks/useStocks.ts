import { useQuery } from '@tanstack/react-query'
import { stocksApi } from '../api/client'

export function useStocks() {
  return useQuery({
    queryKey: ['stocks', 'quotes'],
    queryFn: stocksApi.getQuotes,
    staleTime: 60 * 1000,
  })
}

export function useIndices() {
  return useQuery({
    queryKey: ['stocks', 'indices'],
    queryFn: stocksApi.getIndices,
    staleTime: 60 * 1000,
  })
}
