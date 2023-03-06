import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
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

type PerfData = {
  tokenPriceChange: number
  timestamp: number
}

const VaultsChartPerf = withSuspense(
  ({ market, interval, ...styleProps }: Props) => {
    const vaultStats = useVaultStats(market, getChartIntervalSeconds(interval))
    const liquidityHistory = vaultStats?.liquidityHistory
    const firstTokenPrice = liquidityHistory ? fromBigNumber(liquidityHistory[0].tokenPrice) : 0

    const data: PerfData[] = useMemo(() => {
      return (
        liquidityHistory?.map(snapshot => ({
          tokenPriceChange: firstTokenPrice
            ? (fromBigNumber(snapshot.tokenPrice) - firstTokenPrice) / firstTokenPrice
            : 0,
          timestamp: snapshot.timestamp,
        })) ?? []
      )
    }, [liquidityHistory, firstTokenPrice])

    const [hoverData, setHoverData] = useState<PerfData | null>(null)

    if (!data.length) {
      return null
    }

    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyLargeMedium">
          {formatPercentage(hoverData?.tokenPriceChange ?? vaultStats?.tokenPriceChange ?? 0)}
        </Text>
        <Text variant="small" color="secondaryText">
          {formatTimestampTooltip(hoverData?.timestamp ?? market.block.timestamp, interval)}
        </Text>
        <LineChart<PerfData>
          mt={1}
          height={VAULTS_CHART_HEIGHT}
          type="linear"
          hideXAxis={false}
          data={data}
          xAxisDataKey="timestamp"
          dataKeys={[{ key: 'tokenPriceChange', label: 'timestamp' }]}
          lineColor="primary"
          onHover={setHoverData}
        />
      </Flex>
    )
  },
  ({ market, interval, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyLargeMedium" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={VAULTS_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default React.memo(VaultsChartPerf)
