import Center from '@lyra/ui/components/Center'
import LineChart from '@lyra/ui/components/LineChart'
import Spinner from '@lyra/ui/components/Spinner'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useSpotPriceHistory from '@/app/hooks/market/useSpotPriceHistory'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  market: Market
  period: ChartPeriod
  hoverSpotPrice: number | null
  onHover: (spotPrice: number | null) => void
} & MarginProps &
  LayoutProps

const SpotPriceLineChart = withSuspense(
  ({ market, period, onHover = emptyFunction, hoverSpotPrice, ...styleProps }: Props) => {
    const history = useSpotPriceHistory(market, period)
    const defaultSpotPrice = market ? fromBigNumber(market.spotPrice) : null
    const spotPrice = hoverSpotPrice ?? defaultSpotPrice
    const prevSpotPrice = history.length > 0 ? history[0].price : null
    const pctChange = spotPrice && prevSpotPrice ? (spotPrice - prevSpotPrice) / prevSpotPrice : 0
    return (
      <LineChart
        {...styleProps}
        type="linear"
        data={history}
        dataKeys={[{ key: 'price', label: 'price' }]}
        onHover={pt => onHover(pt?.price ?? null)}
        lineColor={pctChange >= 0 ? 'primary' : 'error'}
        renderTooltip={({ x }) => formatTimestampTooltip(x, period)}
      />
    )
  },
  ({ market, period, hoverSpotPrice, onHover, ...styleProps }: Props) => (
    <Center height="100%" {...styleProps}>
      <Spinner />
    </Center>
  )
)

export default React.memo(SpotPriceLineChart)
