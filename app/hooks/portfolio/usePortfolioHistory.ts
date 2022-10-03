import { AccountPortfolioSnapshot } from '@lyrafinance/lyra-js'

import { ChartPeriod } from '@/app/constants/chart'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

export type PortfolioSnapshot = Omit<AccountPortfolioSnapshot, 'baseAccountBalances' | 'stableAccountBalances'>

const fetcher = async (owner: string, period: ChartPeriod) => {
  const block = await lyra.provider.getBlock('latest')
  const startTimestamp = getChartPeriodStartTimestamp(block.timestamp, period)
  return await lyra.account(owner).portfolioHistory(startTimestamp)
}

const EMPTY_HISTORY: PortfolioSnapshot[] = []

export default function usePortfolioHistory(period: ChartPeriod): PortfolioSnapshot[] {
  const owner = useWalletAccount()
  const [history] = useFetch('PortfolioHistory', owner && period ? [owner, period] : null, fetcher)
  return history ?? EMPTY_HISTORY
}
