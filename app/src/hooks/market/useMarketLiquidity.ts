import { Market, MarketLiquiditySnapshot } from '@lyrafinance/lyra-js'
import Lyra from '@lyrafinance/lyra-js'

import { useLyraFetch } from '../data/useLyraFetch'

export const fetchMarketLiquidity = async (
  lyra: Lyra,
  marketAddressOrName: string
): Promise<MarketLiquiditySnapshot> => {
  const market = await lyra.market(marketAddressOrName)
  return await market.liquidity()
}

export default function useMarketLiquidity(market: Market | null): MarketLiquiditySnapshot | null {
  const [marketLiquidity] = useLyraFetch(
    'MarketLiquidity',
    market ? market.lyra : null,
    market ? [market.address] : null,
    fetchMarketLiquidity
  )
  return marketLiquidity
}
