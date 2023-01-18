import fromBigNumber from '@/app/utils/fromBigNumber'

import useFetch from '../data/useFetch'
import { fetchMarkets } from '../market/useMarkets'

export const fetchAggregateTVL = async (): Promise<number> => {
  const markets = await fetchMarkets()
  const marketsLiquidity = await Promise.all(markets.map(market => market.liquidity()))
  return marketsLiquidity.reduce((sum, marketLiquidity) => sum + fromBigNumber(marketLiquidity.tvl), 0)
}

export default function useAggregateTVL(): number {
  const [tvl] = useFetch('AggregateTVL', [], fetchAggregateTVL)
  return tvl ?? 0
}
