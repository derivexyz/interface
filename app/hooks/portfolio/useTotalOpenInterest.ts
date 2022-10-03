import { useMemo } from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

import useMarkets from '../market/useMarkets'

export default function useTotalOpenInterest(): number {
  const markets = useMarkets()
  // TODO: @dappbeast Move to SDK
  return useMemo(() => {
    return markets.reduce((sum, market) => {
      return sum + fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice)
    }, 0)
  }, [markets])
}
