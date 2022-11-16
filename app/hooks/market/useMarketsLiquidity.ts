import { MarketLiquidity } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

export type MarketsLiquidity = {
  [marketAddress: string]: MarketLiquidity
}

export const fetchMarketsLiquidity = async (): Promise<MarketsLiquidity> => {
  const markets = await lyra.markets()
  const marketsLiquidity = await Promise.all(markets.map(market => market.liquidity()))
  return marketsLiquidity.reduce(
    (marketToLiquidity, marketLiquidity, i) => ({
      ...marketToLiquidity,
      [markets[i].address]: marketLiquidity,
    }),
    {}
  )
}

export default function useMarketsLiquidity(): MarketsLiquidity | null {
  const [marketsLiquidity] = useFetch('MarketsLiquidity', [], fetchMarketsLiquidity)
  return marketsLiquidity
}
