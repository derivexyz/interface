import { AccountPortfolioBalance, Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

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

const fetcher = async (network: Network, owner: string) => await getLyraSDK(network).account(owner).portfolioBalance()

export default function usePortfolioBalance(network: Network): AccountPortfolioBalance {
  const owner = useWalletAccount()
  const [market] = useFetch('PortfolioBalance', owner ? [network, owner] : null, fetcher)
  return market ?? EMPTY
}
