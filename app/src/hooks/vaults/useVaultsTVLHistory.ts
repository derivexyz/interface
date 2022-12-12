import { ChartPeriod } from '@/app/constants/chart'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'
import { fetchVaultTVLHistory } from './useVaultTVLHistory'

export type VaultsTVLSnapshot = {
  total: number
  timestamp: number
}

const EMPTY: VaultsTVLSnapshot[] = []

const fetcher = async (period: ChartPeriod) => {
  const marketAddresses = await lyra.marketAddresses()
  const histories = (
    await Promise.all(marketAddresses.map(marketAddress => fetchVaultTVLHistory(marketAddress, period)))
  ).filter(h => h.length)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currSnapshots = histories.map(history => history.shift()!)
  const uniqueTimestamps = Array.from(new Set(histories.flat().map(s => s.timestamp))).sort()
  return uniqueTimestamps.map(timestamp => {
    histories.forEach((history, idx) => {
      if (history[0] && timestamp >= history[0].timestamp) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currSnapshots[idx] = history.shift()!
      }
    })
    const total = currSnapshots.reduce((sum, snap) => sum + snap.total, 0)
    return {
      total,
      timestamp,
    }
  })
}

export default function useVaultsTVLHistory(period: ChartPeriod): VaultsTVLSnapshot[] {
  const [vaultsHistory] = useFetch('VaultsTVLHistory', period ? [period] : null, fetcher)
  return vaultsHistory ?? EMPTY
}
