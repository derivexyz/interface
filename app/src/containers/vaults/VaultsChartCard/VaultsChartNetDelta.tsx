import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { Market } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
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
  netDelta: number
  timestamp: number
}

const VaultsChartNetDelta = withSuspense(
  ({ market, interval, ...styleProps }: Props) => {
    const vaultStats = useVaultStats(market, getChartIntervalSeconds(interval))
    const netGreeksHistory = vaultStats?.netGreeksHistory

    const data: PerfData[] = useMemo(() => {
      return (
        netGreeksHistory?.map(snapshot => ({
          netDelta: fromBigNumber(snapshot.netDelta),
          timestamp: snapshot.timestamp,
        })) ?? []
      )
    }, [netGreeksHistory])

    const [hoverData, setHoverData] = useState<PerfData | null>(null)

    if (!data.length) {
      return null
    }

    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyLarge">
          {formatNumber(hoverData?.netDelta ?? fromBigNumber(vaultStats?.netGreeks.netDelta ?? ZERO_BN), { dps: 3 })}
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
          dataKeys={[{ key: 'netDelta', label: 'timestamp' }]}
          lineColor="primary"
          onHover={setHoverData}
        />
      </Flex>
    )
  },
  ({ market, interval, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyLarge" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={VAULTS_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default React.memo(VaultsChartNetDelta)
