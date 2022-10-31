import AreaChart from '@lyra/ui/components/AreaChart'
import Center from '@lyra/ui/components/Center'
import Shimmer from '@lyra/ui/components/Shimmer'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import { VAULTS_INDEX_CHART_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultsTVLHistory, { VaultsTVLSnapshot } from '@/app/hooks/vaults/useVaultsTVLHistory'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  period: ChartPeriod
  hoverData: VaultsTVLSnapshot | null
  onHover?: (pt: VaultsTVLSnapshot | null) => void
} & MarginProps &
  PaddingProps

const VaultsIndexTVLChartCardChart = withSuspense(
  ({ period, hoverData, onHover = emptyFunction, ...styleProps }: Props) => {
    const vaultHistoryTVL = useVaultsTVLHistory(period)
    const vaultBalanceTVL = vaultHistoryTVL.length > 0 ? vaultHistoryTVL[vaultHistoryTVL.length - 1] : null
    const earliestSnapshot = vaultHistoryTVL.length > 0 ? vaultHistoryTVL[0] : null
    const total = hoverData?.total ?? vaultBalanceTVL?.total ?? 0
    const earliestTotal = earliestSnapshot?.total ?? 0
    const change = earliestTotal == 0 ? 0 : (total - earliestTotal) / earliestTotal
    return (
      <AreaChart
        {...styleProps}
        height={VAULTS_INDEX_CHART_HEIGHT}
        type="linear"
        xAxisDataKey="timestamp"
        data={vaultHistoryTVL}
        dataKeys={[{ key: 'total', label: 'timestamp' }]}
        color={change >= 0 ? 'primary' : 'error'}
        onHover={onHover}
        renderTooltip={({ timestamp }) => formatTimestampTooltip(timestamp, period)}
      />
    )
  },
  ({ period, onHover, ...styleProps }: Props) => (
    <Center {...styleProps} height={VAULTS_INDEX_CHART_HEIGHT}>
      <Shimmer width="100%" height="100%" />
    </Center>
  )
)

export default VaultsIndexTVLChartCardChart
