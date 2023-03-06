import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountPnlSnapshot } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'

import { ChartInterval } from '@/app/constants/chart'
import { PORTFOLIO_CHART_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useProfitLossHistory from '@/app/hooks/portfolio/useProfitLossHistory'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  interval: ChartInterval
} & MarginProps

const PortfolioProfitLossChart = withSuspense(
  ({ interval, ...styleProps }: Props) => {
    const userPnlHistory = useProfitLossHistory(interval)
    const [hoverData, setHoverData] = useState<AccountPnlSnapshot | null>(null)

    const latestPnl = userPnlHistory[userPnlHistory.length - 1]
    const pnlTitle = hoverData?.livePnl ?? latestPnl?.livePnl ?? 0
    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyLargeMedium">{formatUSD(pnlTitle)}</Text>
        <Text variant="small" color="secondaryText">
          {formatTimestampTooltip(
            hoverData?.timestamp ?? latestPnl?.timestamp ?? Date.now() / 1000,
            ChartInterval.OneMonth
          )}
        </Text>
        <LineChart<AccountPnlSnapshot>
          mt={1}
          hideXAxis={false}
          height={PORTFOLIO_CHART_HEIGHT}
          type="linear"
          data={userPnlHistory}
          xAxisDataKey="timestamp"
          dataKeys={[{ key: 'livePnl', label: 'pnl' }]}
          lineColor={pnlTitle >= 0 ? 'primary' : 'error'}
          range={([min, max]) => [
            // Min [x1.2 for negative value, x0.25 for positive value, x-0.1 to include x-axis]
            Math.min(min * 1.2, min * 0.25, min * -0.1),
            // Max [x0.95 for negative value, x0.1 for positive value, x0.1 to include x-axis]
            Math.max(max * 0.95, (max - min) * 0.1, Math.abs(max * 0.1)),
          ]}
          onHover={setHoverData}
        />
      </Flex>
    )
  },
  ({ interval, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyLargeMedium" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={PORTFOLIO_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default PortfolioProfitLossChart
