import { Market } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '../../utils/lyra'
import useFetch, { useMutate } from '../data/useFetch'

export const fetchMarket = async (marketAddressOrName: string): Promise<Market> =>
  await lyra.market(marketAddressOrName)

export default function useMarket(marketAddressOrName: string | null): Market | null {
  const [market] = useFetch('Market', marketAddressOrName ? [marketAddressOrName] : null, fetchMarket)
  return market
}

export const useMutateMarket = (marketAddressOrName: string | null): (() => Promise<Market | null>) => {
  const mutate = useMutate('Market', fetchMarket)
  return useCallback(
    async () => (marketAddressOrName ? await mutate(marketAddressOrName) : null),
    [mutate, marketAddressOrName]
  )
}
