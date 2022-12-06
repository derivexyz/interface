import { AccountTokenBalance } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import getUniqueBy from '@/app/utils/getUniqueBy'
import isTokenEqual from '@/app/utils/isTokenEqual'

import useBalances from './useBalances'

export default function useQuoteBalance(tokenAddressOrName: string): AccountTokenBalance {
  const balances = useBalances()
  return nullthrows(
    getUniqueBy(
      balances.reduce(
        (quoteBalances, marketBalance) => [...quoteBalances, ...marketBalance.quoteSwapAssets],
        [] as AccountTokenBalance[]
      ),
      balance => balance.address
    ).find(balance => isTokenEqual(balance, tokenAddressOrName)),
    'Failed to fetch quote balance'
  )
}
