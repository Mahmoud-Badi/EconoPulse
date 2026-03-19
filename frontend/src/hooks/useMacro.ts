import { useQuery } from '@tanstack/react-query'
import { macroApi } from '../api/client'

export function useGdp() {
  return useQuery({
    queryKey: ['macro', 'gdp'],
    queryFn: macroApi.getGdp,
    staleTime: 3600 * 1000,
  })
}

export function useInflation() {
  return useQuery({
    queryKey: ['macro', 'inflation'],
    queryFn: macroApi.getInflation,
    staleTime: 3600 * 1000,
  })
}

export function useCpi() {
  return useQuery({
    queryKey: ['macro', 'cpi'],
    queryFn: macroApi.getCpi,
    staleTime: 3600 * 1000,
  })
}

export function useUnemployment() {
  return useQuery({
    queryKey: ['macro', 'unemployment'],
    queryFn: macroApi.getUnemployment,
    staleTime: 3600 * 1000,
  })
}

export function useInterestRate() {
  return useQuery({
    queryKey: ['macro', 'interest-rate'],
    queryFn: macroApi.getInterestRate,
    staleTime: 3600 * 1000,
  })
}

export function useTreasuryYield() {
  return useQuery({
    queryKey: ['macro', 'treasury-yield'],
    queryFn: macroApi.getTreasuryYield,
    staleTime: 3600 * 1000,
  })
}
