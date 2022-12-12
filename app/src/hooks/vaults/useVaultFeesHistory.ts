import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

export type FeesSnapshot = {
  fees: number
  optionFee: number
  spotFee: number
  vegaFee: number
  varianceFee: number
  startTimestamp: number
  endTimestamp: number
  x: number
}

export type VaultFeesHistory = FeesSnapshot[]

const MAX_SNAPSHOTS = 30

export const fetchVaultFeesHistory = async (
  marketAddressOrName: string,
  period: ChartPeriod
): Promise<VaultFeesHistory> => {
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartPeriodStartTimestamp(market.block.timestamp, period)
  const tradingVolumeHistory = await market.tradingVolumeHistory({ startTimestamp })
  const snapshots = tradingVolumeHistory
    .map(tradingVolume => {
      const fees = tradingVolume.deltaCutoffFees
        .add(tradingVolume.lpLiquidationFees)
        .add(tradingVolume.optionPriceFees)
        .add(tradingVolume.spotPriceFees)
        .add(tradingVolume.vegaFees)
        .add(tradingVolume.varianceFees)
      return {
        fees: fromBigNumber(fees),
        optionFee: fromBigNumber(tradingVolume.optionPriceFees),
        spotFee: fromBigNumber(tradingVolume.spotPriceFees),
        vegaFee: fromBigNumber(tradingVolume.vegaFees),
        varianceFee: fromBigNumber(tradingVolume.varianceFees),
        startTimestamp: tradingVolume.startTimestamp,
        endTimestamp: tradingVolume.endTimestamp,
        x: tradingVolume.endTimestamp,
      }
    })
    .sort((a, b) => a.x - b.x)
  const snapshotsPerGroup = Math.ceil(snapshots.length / MAX_SNAPSHOTS)
  const groups: FeesSnapshot[] = []
  for (let i = 0; i < snapshots.length; i++) {
    const snapshot = snapshots[i]
    if (i % snapshotsPerGroup === 0) {
      // Append new group
      groups.push({
        fees: snapshot.fees,
        optionFee: snapshot.optionFee,
        spotFee: snapshot.spotFee,
        vegaFee: snapshot.vegaFee,
        varianceFee: snapshot.varianceFee,
        startTimestamp: snapshot.startTimestamp,
        endTimestamp: snapshot.endTimestamp,
        x: snapshot.x,
      })
    } else if (groups.length > 0) {
      // Aggregate to latest group
      const latestGroup = groups[groups.length - 1]
      latestGroup.fees += snapshot.fees
      latestGroup.optionFee += snapshot.optionFee
      latestGroup.spotFee += snapshot.spotFee
      latestGroup.vegaFee += snapshot.vegaFee
      latestGroup.varianceFee += snapshot.varianceFee
      latestGroup.endTimestamp = snapshot.endTimestamp
    }
  }
  return groups
}

export default function useVaultFeesHistory(marketAddressOrName: string | null, period: ChartPeriod): VaultFeesHistory {
  const [vaultFeesHistory] = useFetch(
    'VaultFeesHistory',
    marketAddressOrName && period ? [marketAddressOrName, period] : null,
    fetchVaultFeesHistory
  )
  return vaultFeesHistory ?? []
}
