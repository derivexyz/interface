import { useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import fromBigNumber from '@/app/utils/fromBigNumber'

import useMarkets from '../market/useMarkets'
import useMarketsLiquidity from '../market/useMarketsLiquidity'

export default function useTotalValueLocked(): number {
  const markets = useMarkets()
  const marketsLiquidity = useMarketsLiquidity()
  const totalValueLocked = useMemo(() => {
    const totalValueLocked = markets.reduce((total, market) => {
      return total + fromBigNumber(marketsLiquidity ? marketsLiquidity[market.address].nav : ZERO_BN)
    }, 0)
    return totalValueLocked
  }, [markets, marketsLiquidity])
  return totalValueLocked ?? 0
}
