import BarChart from '@lyra/ui/components/BarChart'
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

type VolumeData = {
  notionalVolume: number
  endTimestamp: number
  x: number
}

const MAX_BARS = 200

const VaultsChartVolume = withSuspense(
  ({ market, interval, ...styleProps }: Props) => {
    const vaultStats = useVaultStats(market, getChartIntervalSeconds(interval))
    const tradingVolumeHistory = vaultStats?.tradingVolumeHistory

    const data: VolumeData[] = useMemo(() => {
      const snapshots: VolumeData[] =
        tradingVolumeHistory?.map(snapshot => ({
          notionalVolume: fromBigNumber(snapshot.notionalVolume),
          x: snapshot.startTimestamp,
          endTimestamp: snapshot.endTimestamp,
        })) ?? []
      const snapshotsPerGroup = Math.ceil(snapshots.length / MAX_BARS)
      const snapshotChunks: VolumeData[][] = []
      for (let i = snapshots.length - 1; i > 0; i -= snapshotsPerGroup) {
        const chunk = snapshots.slice(i - snapshotsPerGroup, i)
        if (chunk.length > 0) {
          snapshotChunks.push(chunk)
        }
      }

      const groupedSnapshots = snapshotChunks
        .map(snapshotChunk => ({
          x: snapshotChunk[0].x,
          endTimestamp: snapshotChunk[snapshotChunk.length - 1].endTimestamp,
          notionalVolume: snapshotChunk.reduce((sum, { notionalVolume }) => sum + notionalVolume, 0),
        }))
        .reverse()

      return groupedSnapshots
    }, [tradingVolumeHistory])

    const [hoverData, setHoverData] = useState<VolumeData | null>(null)

    if (!data.length) {
      return null
    }

    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyMedium">
          {formatTruncatedUSD(hoverData?.notionalVolume ?? vaultStats?.totalNotionalVolume ?? 0)}
        </Text>
        <Text variant="small" color="secondaryText">
          {hoverData
            ? `${formatTimestampTooltip(hoverData.x, interval)} - ${formatTimestampTooltip(
                hoverData.endTimestamp,
                interval
              )}`
            : `${formatTimestampTooltip(
                market.block.timestamp - getChartIntervalSeconds(interval),
                interval
              )} - ${formatTimestampTooltip(market.block.timestamp, interval)}`}
        </Text>
        <BarChart<VolumeData>
          mt={1}
          height={VAULTS_CHART_HEIGHT}
          data={data}
          dataKeys={[{ key: 'notionalVolume', label: 'x' }]}
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

export default React.memo(VaultsChartVolume)
