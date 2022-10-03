import Center from '@lyra/ui/components/Center'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultNetDeltaHistory, { NetGreeksSnapshot } from '@/app/hooks/vaults/useVaultNetGreeksHistory'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  marketAddressOrName: string
  period: ChartPeriod
  hoverData: NetGreeksSnapshot | null
  onHover?: (pt: NetGreeksSnapshot | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const VaultsStatsChartCardNetDeltaChart = withSuspense(
  ({ marketAddressOrName, hoverData, period, onHover = emptyFunction, ...styleProps }: Props) => {
    const vaultHistoryNetDelta = useVaultNetDeltaHistory(marketAddressOrName, period)
    const netDelta = hoverData?.netDelta ?? vaultHistoryNetDelta[vaultHistoryNetDelta.length - 1].netDelta

    return (
      <LineChart
        {...styleProps}
        type="linear"
        data={vaultHistoryNetDelta}
        dataKeys={[{ key: 'netDelta', label: 'timestamp' }]}
        lineColor={netDelta >= 0 ? 'primary' : 'error'}
        onHover={onHover}
        hideXAxis={false}
        renderTooltip={({ x }) => formatTimestampTooltip(x, period)}
      />
    )
  },
  ({ marketAddressOrName, period, onHover, ...styleProps }: Props) => (
    <Center {...styleProps}>
      <Shimmer width="100%" height="100%" />
    </Center>
  )
)

export default React.memo(VaultsStatsChartCardNetDeltaChart)
