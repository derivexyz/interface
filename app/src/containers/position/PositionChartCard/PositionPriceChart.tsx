import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import { Option } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartInterval } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOptionPriceHistory from '@/app/hooks/position/useOptionPriceHistory'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  option: Option
  interval: ChartInterval
  hoverOptionPrice: number | null
  onHover: (pt: number | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const PositionPriceChart = withSuspense(
  ({ option, interval, onHover, hoverOptionPrice, ...styleProps }: Props) => {
    const data = useOptionPriceHistory(option, interval)
    const latestOptionPrice = (data.length && hoverOptionPrice) ?? data[data.length - 1].optionPrice
    const prevOptionPrice = data.length ? data[0].optionPrice : null
    const pctChange = prevOptionPrice ? (latestOptionPrice - prevOptionPrice) / prevOptionPrice : 0
    return (
      <LineChart
        {...styleProps}
        type="linear"
        data={data}
        dataKeys={[{ key: 'optionPrice', label: 'timestamp' }]}
        onHover={pt => onHover(pt?.optionPrice ?? null)}
        lineColor={pctChange >= 0 ? 'primary' : 'error'}
        renderTooltip={({ x }) => formatTimestampTooltip(x, interval)}
      />
    )
  },
  ({ option, interval, onHover, hoverOptionPrice, ...styleProps }) => <Shimmer {...styleProps} />
)

export default PositionPriceChart
