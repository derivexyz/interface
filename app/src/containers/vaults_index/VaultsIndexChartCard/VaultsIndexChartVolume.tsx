import BarChart from '@lyra/ui/components/BarChart'
import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Shimmer from '@lyra/ui/components/Shimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo, useState } from 'react'

import { ChartInterval } from '@/app/constants/chart'
import { VAULTS_INDEX_CHART_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAggregateVaultStats from '@/app/hooks/vaults/useVaultsAggregatedStats'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'
import getChartIntervalSeconds from '@/app/utils/getChartIntervalSeconds'

type Props = {
  interval: ChartInterval
} & MarginProps

type VolumeData = {
  notionalVolume: number
  endTimestamp: number
  x: number
}

const MAX_BARS = 200

const VaultsIndexChartVolume = withSuspense(
  ({ interval, ...styleProps }: Props) => {
    const vaultStats = useAggregateVaultStats(getChartIntervalSeconds(interval))

    const data: VolumeData[] = useMemo(() => {
      const snapshots: VolumeData[] =
        vaultStats?.tradingVolumeHistory.map(s => ({
          notionalVolume: s.notionalVolume,
          x: s.startTimestamp,
          endTimestamp: s.endTimestamp,
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
    }, [vaultStats])

    const [hoverData, setHoverData] = useState<VolumeData | null>(null)

    if (!data.length) {
      return null
    }

    const endTimestamp = data[data.length - 1].endTimestamp

    return (
      <Flex {...styleProps} flexDirection="column">
        <Text variant="bodyLargeMedium">
          {formatTruncatedUSD(hoverData?.notionalVolume ?? vaultStats?.totalNotionalVolume ?? 0)}
        </Text>
        <Text variant="small" color="secondaryText">
          {hoverData
            ? `${formatTimestampTooltip(hoverData.x, interval)} - ${formatTimestampTooltip(
                hoverData.endTimestamp,
                interval
              )}`
            : `${formatTimestampTooltip(
                endTimestamp - getChartIntervalSeconds(interval),
                interval
              )} - ${formatTimestampTooltip(endTimestamp, interval)}`}
        </Text>
        <BarChart<VolumeData>
          mt={1}
          height={VAULTS_INDEX_CHART_HEIGHT}
          data={data}
          dataKeys={[{ key: 'notionalVolume', label: 'x' }]}
          color="primary"
          range={([min, max]) => [min * 0.25, max * 1.1]}
          onHover={setHoverData}
        />
      </Flex>
    )
  },
  ({ interval, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer width={100} variant="bodyLargeMedium" />
      <TextShimmer width={60} variant="small" />
      <Shimmer mt={1} height={VAULTS_INDEX_CHART_HEIGHT} width="100%" />
    </Box>
  )
)

export default React.memo(VaultsIndexChartVolume)
