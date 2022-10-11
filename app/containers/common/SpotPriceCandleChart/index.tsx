import { OhlcData, Time } from '@lyra/ui/components/CandleChart'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'

import CandleChart from '@/app/components/trade/CandleChart'
import { CandlePeriod, ChartPeriod } from '@/app/constants/chart'
import useSpotPriceHistory from '@/app/hooks/data/useSpotPriceHistory'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'

type Props = {
  marketAddressOrName: string
  period: ChartPeriod
  candlePeriod: CandlePeriod
  onHover: (candle: OhlcData | null) => void
} & MarginProps &
  LayoutProps

const SpotPriceCandleChart = withSuspense(
  ({ marketAddressOrName, period, candlePeriod, onHover, ...styleProps }: Props) => {
    const spotPriceHistory = useSpotPriceHistory(marketAddressOrName, ChartPeriod.SixMonths, candlePeriod)
    const market = useMarket(marketAddressOrName)
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
  ({ marketAddressOrName, period, candlePeriod, onHover, ...styleProps }: Props) => (
    <Center height="100%" {...styleProps}>
      <Spinner />
    </Center>
  )
)

export default React.memo(SpotPriceCandleChart, (prevProps, nextProps) => {
  return (
    prevProps.marketAddressOrName === nextProps.marketAddressOrName &&
    prevProps.period === nextProps.period &&
    prevProps.candlePeriod === nextProps.candlePeriod &&
    prevProps.onHover === nextProps.onHover
  )
})
