import AreaChart from '@lyra/ui/components/AreaChart'
import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Shimmer from '@lyra/ui/components/Shimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import { Market } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import { VAULTS_CHART_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultStats from '@/app/hooks/vaults/useVaultStats'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodTimestamp from '@/app/utils/getChartPeriodTimestamp'

type Props = {
  market: Market
  period: ChartPeriod
} & MarginProps

type TVLData = {
  tvl: number
  timestamp: number
}

const VaultsChartTVL = withSuspense(
  ({ market, period, ...styleProps }: Props) => {
    const vaultStats = useVaultStats(market, getChartPeriodTimestamp(period))
    const liquidityHistory = vaultStats?.liquidityHistory

    const data: TVLData[] = useMemo(() => {
      return (
        liquidityHistory?.map(snapshot => ({ tvl: fromBigNumber(snapshot.tvl), timestamp: snapshot.timestamp })) ?? []
      )
    }, [liquidityHistory])

    const [hoverData, setHoverData] = useState<TVLData | null>(null)

    if (!data.length) {
      return null
    }

    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyLarge">{formatTruncatedUSD(hoverData?.tvl ?? vaultStats?.tvl ?? 0)}</Text>
        <Text variant="small" color="secondaryText">
          {formatTimestampTooltip(hoverData?.timestamp ?? market.block.timestamp, period)}
        </Text>
        <AreaChart<TVLData>
          mt={1}
          height={VAULTS_CHART_HEIGHT}
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
  ({ market, period, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyLarge" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={VAULTS_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default React.memo(VaultsChartTVL)
