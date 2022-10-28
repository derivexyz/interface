import Center from '@lyra/ui/components/Center'
import LineChart from '@lyra/ui/components/LineChart'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultPNLHistory, { PNLSnapshot } from '@/app/hooks/vaults/useVaultPNLHistory'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  marketAddressOrName: string
  period: ChartPeriod
  hoverData: PNLSnapshot | null
  onHover?: (pt: PNLSnapshot | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const VaultsStatsChartCardPNLChart = withSuspense(
  ({ marketAddressOrName, hoverData, period, onHover = emptyFunction, ...styleProps }: Props) => {
    const vaultHistoryPNL = useVaultPNLHistory(marketAddressOrName, period)
    const vaultBalancePNL = useMemo(() => vaultHistoryPNL[vaultHistoryPNL.length - 1], [vaultHistoryPNL])
    const pnl = hoverData?.pnl ?? vaultBalancePNL.pnl
    const earliestHistory = vaultHistoryPNL[0]
    const earliestPNL = earliestHistory.pnl ?? 0
    const change = earliestPNL == 0 ? 0 : (pnl - earliestPNL) / earliestPNL
    return (
      <LineChart
        {...styleProps}
        type="linear"
        data={vaultHistoryPNL}
        dataKeys={[{ key: 'pnl', label: 'timestamp' }]}
        lineColor={change >= 0 ? 'primary' : 'error'}
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

export default React.memo(VaultsStatsChartCardPNLChart)
