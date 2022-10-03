import { ChartPeriod } from '@lyra/app/constants/chart'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import { Strike } from '@lyrafinance/lyra-js'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useIVHistory from '@/app/hooks/gql/useIVHistory'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  strike: Strike
  period: ChartPeriod
  hoverImpliedVolatility: number | null
  onHover: (pt: number | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const PositionIVChart = withSuspense(
  ({ strike, period, hoverImpliedVolatility, onHover, ...styleProps }: Props) => {
    const data = useIVHistory(strike, period)
    const iv = hoverImpliedVolatility ?? data[data.length - 1].iv
    const prevIv = data[0].iv
    const pctChange = prevIv ? (iv - prevIv) / prevIv : 0
    return (
      <LineChart
        {...styleProps}
        type="linear"
        data={data}
        xAxisDataKey="timestamp"
        dataKeys={[{ key: 'iv', label: 'timestamp' }]}
        lineColor={pctChange >= 0 ? 'primary' : 'error'}
        onHover={pt => {
          onHover(pt?.iv ?? null)
        }}
        renderTooltip={({ timestamp }) => formatTimestampTooltip(timestamp, period)}
      />
    )
  },
  ({ strike, period, hoverImpliedVolatility, onHover, ...styleProps }) => <Shimmer {...styleProps} />
)

export default PositionIVChart
