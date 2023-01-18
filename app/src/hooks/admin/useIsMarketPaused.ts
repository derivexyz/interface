import Lyra from '@lyrafinance/lyra-js'
import { Market } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { useMutate } from '../data/useFetch'
import { useLyraFetch } from '../data/useLyraFetch'

const fetcher = async (lyra: Lyra, marketAddress: string) => await lyra.admin().isMarketPaused(marketAddress)

export default function useIsMarketPaused(market: Market): boolean | null {
  const [isGlobalPaused] = useLyraFetch('IsMarketPaused', market.lyra, [market.address], fetcher)
  return isGlobalPaused
}

export const useMutateIsMarketPaused = (market: Market): (() => Promise<boolean | null>) => {
  const mutate = useMutate('IsMarketPaused', fetcher)
  return useCallback(async () => await mutate(market.lyra, market.address), [mutate, market])
}
