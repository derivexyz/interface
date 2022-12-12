import { MarketGlobalCache } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (marketAddress: string) => {
  return await lyra.admin().getMarketGlobalCache(marketAddress)
}

export default function useGlobalCache(marketAddress: string): MarketGlobalCache | null {
  const [globalOwner] = useFetch('GlobalCache', [marketAddress], fetcher)
  return globalOwner ?? null
}

export function useMutateGlobalCache(marketAddress: string): () => Promise<MarketGlobalCache | null> {
  const mutate = useMutate('GlobalCache', fetcher)
  return useCallback(async () => await mutate(marketAddress), [mutate, marketAddress])
}
