import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

export type NetGreeksSnapshot = {
  netDelta: number
  poolNetDelta: number
  hedgerNetDelta: number
  netStdVega: number
  x: number
}

export const fetchVaultNetDeltaHistory = async (
  marketAddressOrName: string,
  period: ChartPeriod
): Promise<NetGreeksSnapshot[]> => {
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartPeriodStartTimestamp(market.block.timestamp, period)
  const netGreeksHistory = await market.netGreeksHistory({ startTimestamp })
  const vaultNetDeltaHistory: NetGreeksSnapshot[] = netGreeksHistory.map(netGreeksSnapshot => {
    return {
      netDelta: fromBigNumber(netGreeksSnapshot.netDelta),
      poolNetDelta: fromBigNumber(netGreeksSnapshot.poolNetDelta),
      hedgerNetDelta: fromBigNumber(netGreeksSnapshot.hedgerNetDelta),
      netStdVega: fromBigNumber(netGreeksSnapshot.netStdVega),
      x: netGreeksSnapshot.timestamp,
    }
  })
  return vaultNetDeltaHistory
}

export default function useVaultNetGreeksHistory(
  marketAddressOrName: string | null,
  period: ChartPeriod
): NetGreeksSnapshot[] {
  const [netGreeksHistory] = useFetch(
    'NetGreeksHistory',
    marketAddressOrName && period ? [marketAddressOrName, period] : null,
    fetchVaultNetDeltaHistory
  )
  return netGreeksHistory ?? []
}
