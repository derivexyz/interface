import AreaChart from '@lyra/ui/components/AreaChart'
import Center from '@lyra/ui/components/Center'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultTVLHistory, { TVLSnapshot } from '@/app/hooks/vaults/useVaultTVLHistory'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  marketAddressOrName: string
  period: ChartPeriod
  hoverData: TVLSnapshot | null
  onHover?: (pt: TVLSnapshot | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const VaultsStatsChartCardTVLChart = withSuspense(
  ({ marketAddressOrName, hoverData, period, onHover = emptyFunction, ...styleProps }: Props) => {
    const vaultHistoryTVL = useVaultTVLHistory(marketAddressOrName, period)
    const vaultBalanceTVL = useMemo(() => vaultHistoryTVL[vaultHistoryTVL.length - 1], [vaultHistoryTVL])
    const total = hoverData?.total ?? vaultBalanceTVL.total
    const earliestHistory = vaultHistoryTVL[0]
    const earliestTotal = earliestHistory.total ?? 0
    const change = earliestTotal == 0 ? 0 : (total - earliestTotal) / earliestTotal
    return (
      <AreaChart
        {...styleProps}
        type="linear"
        data={vaultHistoryTVL}
        xAxisDataKey="timestamp"
        dataKeys={[{ key: 'total', label: 'timestamp' }]}
        color={change >= 0 ? 'primary' : 'error'}
        onHover={onHover}
        renderTooltip={({ timestamp }) => formatTimestampTooltip(timestamp, period)}
      />
    )
  },
  ({ marketAddressOrName, period, onHover, ...styleProps }: Props) => (
    <Center {...styleProps}>
      <Shimmer width="100%" height="100%" />
    </Center>
  )
)

export default React.memo(VaultsStatsChartCardTVLChart)
