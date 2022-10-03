import { useMemo } from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

import useMarkets from '../market/useMarkets'

export default function useTotalValueLocked(): number {
  const markets = useMarkets()
  const totalValueLocked = useMemo(() => {
    const totalValueLocked = markets.reduce((total, market) => {
      return total + fromBigNumber(market.tvl)
    }, 0)
    return totalValueLocked
  }, [markets])
  return totalValueLocked ?? 0
}
