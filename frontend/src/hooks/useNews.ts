import { useQuery } from '@tanstack/react-query'
import { newsApi } from '../api/client'

export function useNews() {
  return useQuery({
    queryKey: ['news', 'headlines'],
    queryFn: newsApi.getHeadlines,
    staleTime: 600 * 1000,
  })
}

export function useTopNews() {
  return useQuery({
    queryKey: ['news', 'top'],
    queryFn: newsApi.getTop,
    staleTime: 600 * 1000,
  })
}
