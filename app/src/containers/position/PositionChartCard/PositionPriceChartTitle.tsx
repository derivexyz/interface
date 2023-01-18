import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOptionPriceHistory from '@/app/hooks/position/useOptionPriceHistory'

type Props = {
  option: Option
  hoverOptionPrice: number | null
  period: ChartPeriod
} & MarginProps &
  PaddingProps

const PositionPriceChartTitle = withSuspense(
  ({ option, hoverOptionPrice, period, ...styleProps }: Props) => {
    const history = useOptionPriceHistory(option, period)
    if (history.length === 0) {
      return null
    }
    const optionPrice = hoverOptionPrice ?? history[history.length - 1].optionPrice
    const prevOptionPrice = history[0].optionPrice
    const change = prevOptionPrice ? optionPrice - prevOptionPrice : 0
    const pctChange = change ? change / prevOptionPrice : 0
    return (
      <Box {...styleProps}>
        <Text variant="heading">{formatUSD(optionPrice)}</Text>
        <Text variant="smallMedium" color={pctChange < 0 ? 'errorText' : 'primaryText'}>
          {formatPercentage(pctChange)}
        </Text>
      </Box>
    )
  },
  ({ option, hoverOptionPrice, period, ...styleProps }) => (
    <Box {...styleProps}>
      <TextShimmer variant="heading" />
      <TextShimmer variant="smallMedium" width={100} />
    </Box>
  )
)

export default PositionPriceChartTitle
