import { GlobalCache } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (marketAddress: string) => {
  const market = await lyra.market(marketAddress)
  return await market.getGlobalCache()
}

export default function useGlobalCache(marketAddress: string): GlobalCache | null {
  const [globalOwner] = useFetch('GlobalCache', [marketAddress], fetcher)
  return globalOwner ?? null
}

export function useMutateGlobalCache(marketAddress: string): () => Promise<GlobalCache | null> {
  const mutate = useMutate('GlobalCache', fetcher)
  return useCallback(async () => await mutate(marketAddress), [mutate, marketAddress])
}
