import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

export type PNLSnapshot = {
  pnl: number
  x: number
}

export type VaultPNLHistory = PNLSnapshot[]

export const fetchVaultPNLHistory = async (
  marketAddressOrName: string,
  period: ChartPeriod
): Promise<VaultPNLHistory> => {
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartPeriodStartTimestamp(market.block.timestamp, period)
  const liquidityHistory = await market.liquidityHistory({ startTimestamp })
  return liquidityHistory
    .map(liquidity => {
      return {
        pnl: fromBigNumber(liquidity.tokenPrice),
        x: liquidity.timestamp,
      }
    })
    .sort((a, b) => a.x - b.x)
}

export default function useVaultPNLHistory(marketAddressOrName: string | null, period: ChartPeriod): VaultPNLHistory {
  const [vaultPNLHistory] = useFetch(
    'VaultPNLHistory',
    marketAddressOrName && period ? [marketAddressOrName, period] : null,
    fetchVaultPNLHistory
  )
  return vaultPNLHistory ?? []
}
