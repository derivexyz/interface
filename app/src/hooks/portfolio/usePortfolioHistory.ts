import { AccountPortfolioSnapshot, Network } from '@lyrafinance/lyra-js'

import { ChartPeriod } from '@/app/constants/chart'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

export type PortfolioSnapshot = Omit<AccountPortfolioSnapshot, 'baseAccountBalances' | 'stableAccountBalances'>

const fetcher = async (network: Network, owner: string, period: ChartPeriod) => {
  const lyra = getLyraSDK(network)
  const block = await lyra.provider.getBlock('latest')
  const startTimestamp = getChartPeriodStartTimestamp(block.timestamp, period)
  return await lyra.account(owner).portfolioHistory(startTimestamp)
}

const EMPTY_HISTORY: PortfolioSnapshot[] = []

export default function usePortfolioHistory(network: Network, period: ChartPeriod): PortfolioSnapshot[] {
  const owner = useWalletAccount()
  const [history] = useFetch('PortfolioHistory', owner && period ? [network, owner, period] : null, fetcher)
  return history ?? EMPTY_HISTORY
}
