import { useQuery } from '@tanstack/react-query'
import { cryptoApi } from '../api/client'

export function useCrypto() {
  return useQuery({
    queryKey: ['crypto', 'listings'],
    queryFn: cryptoApi.getListings,
    staleTime: 60 * 1000,
  })
}

export function useCryptoGlobal() {
  return useQuery({
    queryKey: ['crypto', 'global'],
    queryFn: cryptoApi.getGlobal,
    staleTime: 60 * 1000,
  })
}
