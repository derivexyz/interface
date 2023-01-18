import { Market, MarketGlobalCache } from '@lyrafinance/lyra-js'
import Lyra from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { useMutate } from '../data/useFetch'
import { useLyraFetch } from '../data/useLyraFetch'

const fetcher = async (lyra: Lyra, marketAddress: string) => {
  return await lyra.admin().getMarketGlobalCache(marketAddress)
}

export default function useGlobalCache(market: Market): MarketGlobalCache | null {
  const [globalOwner] = useLyraFetch('GlobalCache', market.lyra, [market.address], fetcher)
  return globalOwner ?? null
}

export function useMutateGlobalCache(market: Market): () => Promise<MarketGlobalCache | null> {
  const mutate = useMutate('GlobalCache', fetcher)
  return useCallback(async () => await mutate(market.lyra, market.address), [mutate, market])
}
