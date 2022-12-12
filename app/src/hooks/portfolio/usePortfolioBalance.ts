import { AccountPortfolioBalance } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const EMPTY: AccountPortfolioBalance = {
  longOptionValue: 0,
  shortOptionValue: 0,
  baseCollateralValue: 0,
  baseAccountValue: 0,
  stableCollateralValue: 0,
  stableAccountValue: 0,
  totalValue: 0,
  positions: [],
  baseAccountBalances: [],
  stableAccountBalances: [],
}

const fetcher = async (owner: string) => {
  return await lyra.account(owner).portfolioBalance()
}

export default function usePortfolioBalance(): AccountPortfolioBalance {
  const owner = useWalletAccount()
  const [market] = useFetch('PortfolioBalance', owner ? [owner] : null, fetcher)
  return market ?? EMPTY
}
