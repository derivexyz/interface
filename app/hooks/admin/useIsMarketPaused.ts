import { useCallback } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (marketAddress: string) => await lyra.admin().isMarketPaused(marketAddress)

export default function useIsMarketPaused(marketAddress: string): boolean | null {
  const [isGlobalPaused] = useFetch('IsMarketPaused', [marketAddress], fetcher)
  return isGlobalPaused
}

export const useMutateIsMarketPaused = (marketAddress: string): (() => Promise<boolean | null>) => {
  const mutate = useMutate('IsMarketPaused', fetcher)
  return useCallback(async () => await mutate(marketAddress), [mutate, marketAddress])
}
