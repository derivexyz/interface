import { Market } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import useMarkets from './useMarkets'

export default function useMarket(marketAddressOrName: string | null): Market | null {
  const markets = useMarkets()
  return useMemo(() => {
    try {
      return marketAddressOrName ? Market.find(markets, marketAddressOrName) : null
    } catch (e) {
      return null
    }
  }, [markets, marketAddressOrName])
}
