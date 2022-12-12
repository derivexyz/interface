import { AccountBalances, AccountQuoteBalance } from '@lyrafinance/lyra-js'

import { to18DecimalBN } from './convertBNDecimals'

export default function getDefaultStableAddress(balances: AccountBalances): AccountQuoteBalance {
  return balances.quoteSwapAssets.reduce((currDefaultStable, stable) => {
    const stableBalance = stable.decimals !== 18 ? to18DecimalBN(stable.balance, stable.decimals) : stable.balance
    return stableBalance.gt(currDefaultStable.balance) ? stable : currDefaultStable
  }, balances.quoteAsset)
}
