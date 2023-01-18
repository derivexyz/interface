import fromBigNumber from '@/app/utils/fromBigNumber'

import useFetch from '../data/useFetch'
import { fetchMarkets } from '../market/useMarkets'

export type AgggregateLiquiditySnapshot = {
  timestamp: number
  tvl: number
}

export type AgggregateTradingVolumeSnapshot = {
  startTimestamp: number
  endTimestamp: number
  notionalVolume: number
}

export type AggregateVaultStats = {
  tvl: number
  tvlChange: number
  totalNotionalVolume: number
  totalNotionalVolumeChange: number
  totalFees: number
  openInterest: number
  liquidityHistory: AgggregateLiquiditySnapshot[]
  tradingVolumeHistory: AgggregateTradingVolumeSnapshot[]
}

export const fetchAggregateVaultsStats = async (period: number): Promise<AggregateVaultStats> => {
  const markets = await fetchMarkets()
  const marketHistories = await Promise.all(
    markets.map(market =>
      Promise.all([
        market.liquidityHistory({ startTimestamp: market.block.timestamp - period }),
        market.tradingVolumeHistory({ startTimestamp: market.block.timestamp - period }),
      ])
    )
  )

  const liquidityHistory = marketHistories.map(m => m[0])
  const liquidity = liquidityHistory.map(s => s[s.length - 1])
  const liquidityOld = liquidityHistory.map(s => s[0])
  const tvl = liquidity.reduce((sum, s) => sum + fromBigNumber(s.tvl), 0)
  const tvlOld = liquidityOld.reduce((sum, s) => sum + fromBigNumber(s.tvl), 0)
  const tvlChange = tvlOld > 0 ? (tvl - tvlOld) / tvlOld : 0

  const volumeHistory = marketHistories.map(m => m[1])
  const volumeNew = volumeHistory.map(s => s[s.length - 1])
  const volumeOld = volumeHistory.map(s => s[0])
  const totalNotionalVolumeNew = volumeNew.reduce((sum, s) => sum + fromBigNumber(s.totalNotionalVolume), 0)
  const totalNotionalVolumeOld = volumeOld.reduce((sum, s) => sum + fromBigNumber(s.totalNotionalVolume), 0)
  const totalNotionalVolume = totalNotionalVolumeNew - totalNotionalVolumeOld
  const totalNotionalVolumeChange =
    totalNotionalVolumeOld > 0 ? (totalNotionalVolumeNew - totalNotionalVolumeOld) / totalNotionalVolumeOld : 0

  const totalFees = volumeHistory.reduce(
    (sum, volumeHistory) => sum + volumeHistory.reduce((sum, { vaultFees }) => sum + fromBigNumber(vaultFees), 0),
    0
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currLiquiditySnapshots = liquidityHistory.map(history => history.shift()!)
  const uniqueLiquidityTimestamps = Array.from(new Set(liquidityHistory.flat().map(s => s.timestamp))).sort()
  const mergedLiquidityHistory = uniqueLiquidityTimestamps.map(timestamp => {
    liquidityHistory.forEach((history, idx) => {
      if (history[0] && timestamp >= history[0].timestamp) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currLiquiditySnapshots[idx] = history.shift()!
      }
    })
    const tvl = currLiquiditySnapshots.reduce((sum, snap) => sum + fromBigNumber(snap.tvl), 0)
    return {
      tvl,
      timestamp,
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currVolumeSnapshots = volumeHistory.map(history => history.shift()!)
  const uniqueVolumeTimestamps = Array.from(new Set(volumeHistory.flat().map(s => s.startTimestamp))).sort()
  const mergedVolumeHistory = uniqueVolumeTimestamps.map(startTimestamp => {
    volumeHistory.forEach((history, idx) => {
      if (history[0] && startTimestamp >= history[0].startTimestamp) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currVolumeSnapshots[idx] = history.shift()!
      }
    })
    const notionalVolume = currVolumeSnapshots.reduce((sum, snap) => sum + fromBigNumber(snap.notionalVolume), 0)
    const endTimestamp = currVolumeSnapshots[0].endTimestamp
    return {
      notionalVolume,
      startTimestamp,
      endTimestamp,
    }
  })

  const openInterest = markets.reduce(
    (sum, market) => sum + fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice),
    0
  )

  return {
    tvl,
    tvlChange,
    totalNotionalVolume,
    totalNotionalVolumeChange,
    totalFees,
    openInterest,
    liquidityHistory: mergedLiquidityHistory,
    tradingVolumeHistory: mergedVolumeHistory,
  }
}

export default function useAggregateVaultStats(period: number): AggregateVaultStats | null {
  const [vaultsStats] = useFetch('AggregateVaultStats', [period], fetchAggregateVaultsStats)
  return vaultsStats
}
