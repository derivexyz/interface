import { MarketLiquidity } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

export const fetchMarketLiquidity = async (marketAddressOrName: string): Promise<MarketLiquidity> => {
  const market = await lyra.market(marketAddressOrName)
  return await market.liquidity()
}

export default function useMarketLiquidity(marketAddressOrName: string | null): MarketLiquidity | null {
  const [marketLiquidity] = useFetch(
    'MarketLiquidity',
    marketAddressOrName ? [marketAddressOrName] : null,
    fetchMarketLiquidity
  )
  return marketLiquidity
}
