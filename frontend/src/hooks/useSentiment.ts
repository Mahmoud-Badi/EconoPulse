import { useQuery } from '@tanstack/react-query'
import { sentimentApi } from '../api/client'

export function useFearGreed() {
  return useQuery({
    queryKey: ['sentiment', 'fear-greed'],
    queryFn: sentimentApi.getFearGreed,
    staleTime: 300 * 1000,
  })
}

export function useMarketNews() {
  return useQuery({
    queryKey: ['sentiment', 'market-news'],
    queryFn: sentimentApi.getMarketNews,
    staleTime: 300 * 1000,
  })
}
