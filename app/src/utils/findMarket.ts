import { Market, Network } from '@lyrafinance/lyra-js'

export default function findMarket(markets: Market[], network: Network, marketAddressOrName: string): Market | null {
  return Market.find(
    markets.filter(m => m.lyra.network === network),
    marketAddressOrName
  )
}
