import Center from '@lyra/ui/components/Center'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import useSpotPriceHistory from '@/app/hooks/data/useSpotPriceHistory'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  marketAddressOrName: string
  period: ChartPeriod
  hoverSpotPrice: number | null
  onHover: (spotPrice: number | null) => void
} & MarginProps &
  LayoutProps

const SpotPriceChart = withSuspense(
  ({ marketAddressOrName, period, onHover = emptyFunction, hoverSpotPrice, ...styleProps }: Props) => {
    const market = useMarket(marketAddressOrName)
    const history = useSpotPriceHistory(market?.name ?? '', period)
    const spotPrice = hoverSpotPrice ?? (history.length > 0 ? history[history.length - 1].price : null)
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
  ({ marketAddressOrName, period, hoverSpotPrice, onHover, ...styleProps }: Props) => (
    <Center {...styleProps}>
      <Shimmer width="100%" height="100%" />
    </Center>
  )
)

export default React.memo(SpotPriceChart)
