import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import { Option } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOptionPriceHistory from '@/app/hooks/gql/useOptionPriceHistory'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  option: Option
  period: ChartPeriod
  hoverOptionPrice: number | null
  onHover: (pt: number | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const PositionPriceChart = withSuspense(
  ({ option, period, onHover, hoverOptionPrice, ...styleProps }: Props) => {
    const data = useOptionPriceHistory(option.market().address.toLowerCase(), option.strike().id, option.isCall, period)
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
        renderTooltip={({ x }) => formatTimestampTooltip(x, period)}
      />
    )
  },
  ({ option, period, onHover, hoverOptionPrice, ...styleProps }) => <Shimmer {...styleProps} />
)

export default PositionPriceChart
