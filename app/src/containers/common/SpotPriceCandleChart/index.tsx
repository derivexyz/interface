import { OhlcData, Time } from '@lyra/ui/components/CandleChart'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market, SnapshotPeriod } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import CandleChart from '@/app/components/trade/CandleChart'
import { ChartPeriod } from '@/app/constants/chart'
import useSpotPriceHistory from '@/app/hooks/data/useSpotPriceHistory'
import withSuspense from '@/app/hooks/data/withSuspense'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'

type Props = {
  market: Market
  period: ChartPeriod
  candleDuration: SnapshotPeriod
  onHover: (candle: OhlcData | null) => void
} & MarginProps &
  LayoutProps

const SpotPriceCandleChart = withSuspense(
  ({ market, candleDuration, period, onHover, ...styleProps }: Props) => {
    const spotPriceHistory = useSpotPriceHistory(market, ChartPeriod.SixMonths, candleDuration)
    const showTimeRange = {
      from: getChartPeriodStartTimestamp(market?.block.timestamp ?? 0, period) as Time,
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
    return (
      <CandleChart
        data={candleSeriesData}
        showTimeRange={showTimeRange}
        onHover={candle => onHover(candle ?? candleSeriesData[candleSeriesData.length - 1])}
        {...styleProps}
      />
    )
  },
  ({ market, candleDuration, period, onHover, ...styleProps }: Props) => (
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
    prevProps.period === nextProps.period &&
    prevProps.onHover === nextProps.onHover
  )
})
