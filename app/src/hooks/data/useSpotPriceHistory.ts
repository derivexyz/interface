import { Market, Network, SnapshotPeriod } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from './useFetch'

export type SpotPrice = {
  price: number
  x: number
  endTimestamp: number
  open: number
  close: number
  high: number
  low: number
}

type CandleFilter = {
  synth?: string
  timestamp_gte?: number
  timestamp_lt?: number
  period?: number
}

export type CandleQueryVariables = {
  first?: number
  skip?: number
  orderBy?: string
  orderDirection?: string
  where?: CandleFilter
}

export type SynthetixSpotPriceHistoryResult = {
  id: string
  close: string
  open: string
  high: string
  low: string
  timestamp: string
}

export const fetchSpotPriceHistory = async (
  network: Network,
  marketAddressOrName: string,
  period: ChartPeriod,
  candleDuration?: SnapshotPeriod
): Promise<SpotPrice[]> => {
  const lyra = getLyraSDK(network)
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartPeriodStartTimestamp(market.block.timestamp, period)
  const candles = await market.spotPriceHistory({ startTimestamp, period: candleDuration })
  return candles.map(candle => {
    return {
      price: fromBigNumber(candle.close),
      x: candle.startTimestamp,
      endTimestamp: candle.endTimestamp,
      open: fromBigNumber(candle.open),
      high: fromBigNumber(candle.high),
      low: fromBigNumber(candle.low),
      close: fromBigNumber(candle.close),
    }
  })
}

export default function useSpotPriceHistory(
  market: Market | null,
  period: ChartPeriod,
  candleDuration?: SnapshotPeriod
): SpotPrice[] {
  const [candles] = useFetch(
    'SpotPriceHistory',
    market ? [market.lyra.network, market.address, period, candleDuration] : null,
    fetchSpotPriceHistory
  )

  return useMemo(() => {
    if (!market || !candles) {
      return []
    }
    const latestCandle = candles.length ? candles[candles.length - 1] : null
    const spotPrice = fromBigNumber(market.spotPrice)
    if (latestCandle && latestCandle.endTimestamp > market.block.number) {
      // Update close
      latestCandle.close = spotPrice
      // Update low
      if (spotPrice < latestCandle.low) {
        latestCandle.low = spotPrice
      }
      // Update high
      if (spotPrice > latestCandle.high) {
        latestCandle.low = spotPrice
      }
    }
    return candles
  }, [candles, market])
}
