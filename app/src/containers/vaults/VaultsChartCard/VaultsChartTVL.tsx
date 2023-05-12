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

import { ChartInterval } from '@/app/constants/chart'
import { VAULTS_CHART_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultStats from '@/app/hooks/vaults/useVaultStats'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartIntervalSeconds from '@/app/utils/getChartIntervalSeconds'

type Props = {
  market: Market
  interval: ChartInterval
} & MarginProps

type TVLData = {
  tvl: number
  timestamp: number
}

const VaultsChartTVL = withSuspense(
  ({ market, interval, ...styleProps }: Props) => {
    const vaultStats = useVaultStats(market, getChartIntervalSeconds(interval))
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
        <Text variant="bodyMedium">{formatTruncatedUSD(hoverData?.tvl ?? vaultStats?.tvl ?? 0)}</Text>
        <Text variant="small" color="secondaryText">
          {formatTimestampTooltip(hoverData?.timestamp ?? market.block.timestamp, interval)}
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
  ({ market, interval, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyMedium" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={VAULTS_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default React.memo(VaultsChartTVL)
