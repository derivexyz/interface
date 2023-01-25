import { Market, Network } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import findMarket from '@/app/utils/findMarket'

export default function useFindMarket(
  markets: Market[],
  network: Network | null,
  marketAddressOrName: string | null
): Market | null {
  return useMemo(
    () => (network && marketAddressOrName ? findMarket(markets, network, marketAddressOrName) : null),
    [markets, network, marketAddressOrName]
  )
}
