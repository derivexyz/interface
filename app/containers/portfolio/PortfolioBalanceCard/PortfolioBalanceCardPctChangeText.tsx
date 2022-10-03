import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePortfolioHistory, { PortfolioSnapshot } from '@/app/hooks/portfolio/usePortfolioHistory'

type Props = {
  period: ChartPeriod
  hoverSnapshot: PortfolioSnapshot | null
} & MarginProps

const PortfolioBalanceCardPctChangeText = withSuspense(
  ({ period, hoverSnapshot, ...marginProps }: Props) => {
    const history = usePortfolioHistory(period)
    const currSnapshot = history[history.length - 1]
    if (!history.length) {
      return <Text variant="small">-</Text>
    }
    const latestSnapshot = hoverSnapshot ?? currSnapshot
    const earliestSnapshot = history[0]
    const change = earliestSnapshot && latestSnapshot ? latestSnapshot.totalValue - earliestSnapshot.totalValue : 0
    const pctChange =
      change && Math.floor(earliestSnapshot.totalValue) > 0 ? change / Math.floor(earliestSnapshot.totalValue) : 0
    return (
      <Text variant="smallMedium" color={pctChange >= 0 ? 'primaryText' : 'errorText'} {...marginProps}>
        {change >= 0 ? '+' : ''}
        {formatUSD(change)} ({formatPercentage(pctChange)})
      </Text>
    )
  },
  ({ period, hoverSnapshot, ...marginProps }) => <TextShimmer variant="smallMedium" width={100} {...marginProps} />
)

export default PortfolioBalanceCardPctChangeText
