import { Market } from '@lyrafinance/lyra-js'
import Lyra from '@lyrafinance/lyra-js'

import { useLyraFetch } from '../data/useLyraFetch'

const fetcher = async (lyra: Lyra, marketAddressesOrName: string) => {
  const market = await lyra.market(marketAddressesOrName)
  return await market.owner()
}

export default function useMarketOwner(market: Market): string | null {
  const [owner] = useLyraFetch('MarketOwner', market.lyra, [market.address], fetcher)
  return owner
}
