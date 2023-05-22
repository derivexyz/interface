import { Market, Network, SnapshotPeriod, Version } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { ChartInterval } from '@/app/constants/chart'
import { FetchId } from '@/app/constants/fetch'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartStartTimestamp from '@/app/utils/getChartStartTimestamp'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'

export type SpotPrice = {
  price: number
  x: number
  endTimestamp: number
  open: number
  close: number
  high: number
  low: number
}

export const fetchSpotPriceHistory = async (
  network: Network,
  version: Version,
  marketAddressOrName: string,
  interval: ChartInterval,
  candleDuration?: SnapshotPeriod
): Promise<SpotPrice[]> => {
  const lyra = getLyraSDK(network, version)
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartStartTimestamp(market.block.timestamp, interval)
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
  market: Market,
  interval: ChartInterval,
  candleDuration?: SnapshotPeriod
): SpotPrice[] {
  const [candles] = useFetch(
    FetchId.SpotPriceHistory,
    [market.lyra.network, market.lyra.version, market.address, interval, candleDuration],
    fetchSpotPriceHistory
  )

  // Update latest candle as new market data comes in
  return useMemo(() => {
    if (!candles) {
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
      // Trigger re-render
      return [...candles]
    } else {
      return candles
    }
  }, [candles, market])
}
