import { Market } from '@lyrafinance/lyra-js'

export default function isMarketEqual(market: Market, marketAddressOrName: string): boolean {
  return (
    market.address.toLowerCase() === marketAddressOrName.toLowerCase() ||
    market.name.toLowerCase() === marketAddressOrName.toLowerCase()
  )
}
