import { OhlcData, Time } from '@lyra/ui/components/CandleChart'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market, SnapshotPeriod } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import CandleChart from '@/app/components/trade/CandleChart'
import { ChartInterval } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useSpotPriceHistory from '@/app/hooks/market/useSpotPriceHistory'
import getChartStartTimestamp from '@/app/utils/getChartStartTimestamp'

type Props = {
  market: Market
  interval: ChartInterval
  candleDuration: SnapshotPeriod
  onHover: (candle: OhlcData | null) => void
} & MarginProps &
  LayoutProps

const SpotPriceCandleChart = withSuspense(
  ({ market, candleDuration, interval, onHover, ...styleProps }: Props) => {
    const spotPriceHistory = useSpotPriceHistory(market, ChartInterval.SixMonths, candleDuration)
    const showTimeRange = {
      from: getChartStartTimestamp(market?.block.timestamp ?? 0, interval) as Time,
      to: (market?.block.timestamp ?? 0) as Time,
    }

    const candleSeriesData: OhlcData[] = useMemo(
      () =>
        spotPriceHistory.map(candle => ({
          ...candle,
          time: candle.x as Time,
        })),
      [spotPriceHistory]
    )
    return <CandleChart data={candleSeriesData} showTimeRange={showTimeRange} onHover={onHover} {...styleProps} />
  },
  ({ market, candleDuration, interval, onHover, ...styleProps }: Props) => (
    <Center height="100%" {...styleProps}>
      <Spinner />
    </Center>
  )
)

export default React.memo(SpotPriceCandleChart, (prevProps, nextProps) => {
  return (
    prevProps.market.address === nextProps.market.address &&
    prevProps.candleDuration === nextProps.candleDuration &&
    prevProps.market.spotPrice.eq(nextProps.market.spotPrice) &&
    prevProps.interval === nextProps.interval &&
    prevProps.onHover === nextProps.onHover
  )
})
