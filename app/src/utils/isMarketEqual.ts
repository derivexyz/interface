import { getAddress, isAddress } from '@ethersproject/address'
import { Market } from '@lyrafinance/lyra-js'

export default function isMarketEqual(market: Market, marketAddressOrName: string): boolean {
  if (isAddress(marketAddressOrName)) {
    return market.address === getAddress(marketAddressOrName)
  } else {
    return market.baseToken.symbol.toLowerCase() === marketAddressOrName.toLowerCase()
  }
}
