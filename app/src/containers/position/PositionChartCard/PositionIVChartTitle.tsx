import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { Strike } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartInterval } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useIVHistory from '@/app/hooks/position/useIVHistory'

type Props = {
  strike: Strike
  interval: ChartInterval
  hoverImpliedVolatility: number | null
} & MarginProps &
  LayoutProps

const PositionIVChartTitle = withSuspense(
  ({ strike, hoverImpliedVolatility, interval, ...styleProps }: Props) => {
    const data = useIVHistory(strike, interval)
    const iv = hoverImpliedVolatility ?? data[data.length - 1].iv
    const prevIv = data[0].iv
    const pctChange = prevIv ? (iv - prevIv) / prevIv : 0
    return (
      <Box {...styleProps}>
        <Text variant="heading">{formatPercentage(iv, true)}</Text>
        <Text variant="smallMedium" color={pctChange < 0 ? 'errorText' : 'primaryText'}>
          {formatPercentage(pctChange, true)}
        </Text>
      </Box>
    )
  },
  () => (
    <Box>
      <TextShimmer variant="heading" />
      <TextShimmer variant="smallMedium" />
    </Box>
  )
)

export default PositionIVChartTitle
