import AreaChart from '@lyra/ui/components/AreaChart'
import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Shimmer from '@lyra/ui/components/Shimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo, useState } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import { VAULTS_INDEX_CHART_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAggregateVaultStats from '@/app/hooks/vaults/useAggregateVaultStats'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'
import getChartPeriodTimestamp from '@/app/utils/getChartPeriodTimestamp'

type Props = {
  period: ChartPeriod
} & MarginProps

type TVLData = {
  tvl: number
  timestamp: number
}

const VaultsIndexChartTVL = withSuspense(
  ({ period, ...styleProps }: Props) => {
    const vaultStats = useAggregateVaultStats(getChartPeriodTimestamp(period))
    const data: TVLData[] = useMemo(() => vaultStats?.liquidityHistory ?? [], [vaultStats])

    const [hoverData, setHoverData] = useState<TVLData | null>(null)

    if (!data.length) {
      return null
    }

    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyLarge">{formatTruncatedUSD(hoverData?.tvl ?? vaultStats?.tvl ?? 0)}</Text>
        <Text variant="small" color="secondaryText">
          {formatTimestampTooltip(hoverData?.timestamp ?? data[data.length - 1].timestamp, period)}
        </Text>
        <AreaChart<TVLData>
          mt={1}
          height={VAULTS_INDEX_CHART_HEIGHT}
          type="linear"
          data={data}
          xAxisDataKey="timestamp"
          dataKeys={[{ key: 'tvl', label: 'timestamp' }]}
          color="primary"
          range={([min, max]) => [min * 0.25, max * 1.1]}
          onHover={setHoverData}
        />
      </Flex>
    )
  },
  ({ period, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyLarge" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={VAULTS_INDEX_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default React.memo(VaultsIndexChartTVL)
