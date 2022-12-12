import { FlexProps } from '@lyra/ui/components/Flex'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePortfolioHistory, { PortfolioSnapshot } from '@/app/hooks/portfolio/usePortfolioHistory'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  period: ChartPeriod
  hoverSnapshot: PortfolioSnapshot | null
  onHover: (snapshot: PortfolioSnapshot | null) => void
} & Omit<FlexProps, 'color'>

const PortfolioBalanceCardHistoryChart = withSuspense(
  ({ period, hoverSnapshot, onHover, ...styleProps }: Props) => {
    const history = usePortfolioHistory(period)
    if (history.length === 0) {
      return null
    }
    const latestPortfolio = history[history.length - 1]
    const earliestPortfolio = history[0]
    const hoverPriceTotal = hoverSnapshot?.totalValue ?? latestPortfolio.totalValue
    const pctChangeTotal =
      earliestPortfolio.totalValue === 0
        ? 0
        : (hoverPriceTotal - earliestPortfolio.totalValue) / earliestPortfolio.totalValue
    return (
      <LineChart
        {...styleProps}
        type="linear"
        xAxisDataKey="timestamp"
        data={history}
        dataKeys={[{ key: 'totalValue', label: 'timestamp' }]}
        lineColor={pctChangeTotal >= 0 ? 'primary' : 'error'}
        onHover={payload => {
          onHover(payload)
        }}
        range={([min, max]) => {
          return [min * 0.8, max * 1.2]
        }}
        renderTooltip={data => formatTimestampTooltip(data.timestamp, period)}
        {...styleProps}
      />
    )
  },
  ({ period, hoverSnapshot, onHover, ...styleProps }) => <Shimmer {...styleProps} />
)

export default PortfolioBalanceCardHistoryChart
