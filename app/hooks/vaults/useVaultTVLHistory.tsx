import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

export type TVLSnapshot = {
  total: number
  deposits: number
  withdrawals: number
  utilization: number
  timestamp: number
}

export type VaultTVLHistory = TVLSnapshot[]

export const fetchVaultTVLHistory = async (
  marketAddressOrName: string,
  period: ChartPeriod
): Promise<VaultTVLHistory> => {
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartPeriodStartTimestamp(market.block.timestamp, period)
  const liquidityHistory = await market.liquidityHistory({ startTimestamp })
  return liquidityHistory
    .map(liquidity => {
      return {
        total: fromBigNumber(liquidity.nav),
        deposits: fromBigNumber(liquidity.pendingDeposits),
        withdrawals: fromBigNumber(liquidity.pendingWithdrawals),
        utilization: liquidity.utilization,
        timestamp: liquidity.timestamp,
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}

export default function useVaultTVLHistory(marketAddressOrName: string | null, period: ChartPeriod): VaultTVLHistory {
  const [vaultTVLHistory] = useFetch(
    'VaultTVLHistory',
    marketAddressOrName && period ? [marketAddressOrName, period] : null,
    fetchVaultTVLHistory
  )
  return vaultTVLHistory ?? []
}
