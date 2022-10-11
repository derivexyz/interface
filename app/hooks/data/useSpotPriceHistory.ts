import { ChartPeriod } from '@lyra/app/constants/chart'
import gql from 'graphql-tag'

import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import lyra from '@/app/utils/lyra'

import { SNAPSHOT_RESULT_LIMIT, synthetixClient } from '../apollo/client'
import useFetch from './useFetch'

export type SpotPrice = {
  price: number
  x: number
  change: number
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

export const candlesQuery = gql`
  query candles(
    $period: Int = 300
    $first: Int = 1000
    $skip: Int = 0
    $orderBy: String = "id"
    $orderDirection: String = "desc"
    $block: Block_height #
    $where: Candle_filter!
  ) {
    candles(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      block: $block
      where: $where
    ) {
      id
      synth
      close
      open
      high
      low
      timestamp
      period
    }
  }
`

export type SynthetixSpotPriceHistoryResult = {
  id: string
  close: string
  open: string
  high: string
  low: string
  timestamp: string
}

const getPeriod = (period: ChartPeriod): number => {
  switch (period) {
    case ChartPeriod.OneDay:
    case ChartPeriod.ThreeDays:
      return isOptimismMainnet() ? 300 : 900 // 5 mins
    case ChartPeriod.OneWeek:
    case ChartPeriod.TwoWeeks:
      return 900 // 15 mins
    case ChartPeriod.OneMonth:
    case ChartPeriod.ThreeMonths:
    case ChartPeriod.SixMonths:
    case ChartPeriod.OneYear:
    case ChartPeriod.AllTime:
      return 14400 // 4 hours
  }
}

export const fetchSpotPriceHistory = async (
  marketAddressOrName: string,
  period: ChartPeriod,
  candlePeriod: number,
  limit: number = 1000
): Promise<SpotPrice[]> => {
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = getChartPeriodStartTimestamp(market.block.timestamp, period)

  // TODO: @dappbeast Replace with SDK spot price feed
  const synth = !isOptimismMainnet() ? market.name.toUpperCase() : market.baseToken.symbol
  const variables: CandleQueryVariables = {
    first: limit,
    orderBy: 'timestamp',
    orderDirection: 'asc',
    where: {
      synth,
      timestamp_gte: startTimestamp,
      period: candlePeriod,
    },
  }
  // Loop for all candles
  let allFound = false
  let candles: SynthetixSpotPriceHistoryResult[] = []
  let min = startTimestamp
  while (!allFound) {
    const {
      data: { candles: candleBatch },
    } = await synthetixClient.query<{ candles: SynthetixSpotPriceHistoryResult[] }>({
      query: candlesQuery,
      variables: { ...variables, where: { ...variables.where, timestamp_gte: min } },
      fetchPolicy: 'cache-first',
    })
    candles = candles.concat(candleBatch)
    if (candleBatch.length < SNAPSHOT_RESULT_LIMIT) {
      allFound = true
    } else {
      // Set skip to last iterator val
      min = parseInt(candleBatch[candleBatch.length - 1].timestamp) + 1
    }
  }

  const prevCandle = candles[0]
  const prevSpotPrice = parseFloat(prevCandle.close)
  const spotPriceHistory = candles.map(candle => {
    const currSpotPrice = parseFloat(candle.close)
    const change = prevSpotPrice ? (currSpotPrice - prevSpotPrice) / prevSpotPrice : 0
    return {
      price: currSpotPrice,
      x: parseInt(candle.timestamp),
      change,
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      open: parseFloat(candle.open),
    }
  })

  return spotPriceHistory
}

const EMPTY: SpotPrice[] = []

export default function useSpotPriceHistory(
  marketNameOrAddress: string | null,
  period: ChartPeriod,
  candlePeriod?: number
): SpotPrice[] {
  const [spotPriceData] = useFetch(
    'SpotPriceHistory',
    marketNameOrAddress ? [marketNameOrAddress, period, candlePeriod ?? getPeriod(period)] : null,
    fetchSpotPriceHistory,
    {
      refreshInterval: 10 * 1000, // 10 seconds
    }
  )
  return spotPriceData ?? EMPTY
}
