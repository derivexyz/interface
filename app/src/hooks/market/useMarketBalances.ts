import { AccountBalances } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import useBalances from './useBalances'

export default function useMarketBalances(marketAddressOrName: string): AccountBalances {
  const balances = useBalances()
  const marketBalances = balances.find(
    balance =>
      marketAddressOrName.toLowerCase() === balance.marketAddress.toLowerCase() ||
      marketAddressOrName.toLowerCase() === balance.marketName.toLowerCase()
  )

  return nullthrows(marketBalances, 'Failed to fetch balances')
}
