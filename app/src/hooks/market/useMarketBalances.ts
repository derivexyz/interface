import { AccountBalances, Market } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import useBalances from './useBalances'

export default function useMarketBalances(market: Market): AccountBalances {
  const balances = useBalances(market.lyra.network)
  const marketBalances = balances.find(balance => market.address === balance.marketAddress)
  return nullthrows(marketBalances, 'Failed to fetch balances')
}
