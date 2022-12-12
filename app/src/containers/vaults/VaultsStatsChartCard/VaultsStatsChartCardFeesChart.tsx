import BarChart from '@lyra/ui/components/BarChart'
import Center from '@lyra/ui/components/Center'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultFeesHistory, { FeesSnapshot } from '@/app/hooks/vaults/useVaultFeesHistory'
import emptyFunction from '@/app/utils/emptyFunction'
import formatTimestampTooltip from '@/app/utils/formatTimestampTooltip'

type Props = {
  marketAddressOrName: string
  period: ChartPeriod
  onHover?: (pt: FeesSnapshot | null) => void
} & MarginProps &
  LayoutProps &
  PaddingProps

const VaultsStatsChartCardFeesChart = withSuspense(
  ({ marketAddressOrName, period, onHover = emptyFunction, ...styleProps }: Props) => {
    const data = useVaultFeesHistory(marketAddressOrName, period)
    return (
      <BarChart
        {...styleProps}
        data={data}
        dataKeys={[{ key: 'fees', label: 'Fee' }]}
        renderTooltip={({ startTimestamp, endTimestamp }) =>
          `${formatTimestampTooltip(startTimestamp ?? 0, period)} - ${formatTimestampTooltip(
            endTimestamp ?? 0,
            period
          )}`
        }
        onHover={pt => {
          onHover(pt as FeesSnapshot)
        }}
        onMouseLeave={() => {
          onHover(null)
        }}
      />
    )
  },
  ({ marketAddressOrName, period, onHover, ...styleProps }: Props) => (
    <Center {...styleProps}>
      <Shimmer width="100%" height="100%" />
    </Center>
  )
)

export default React.memo(VaultsStatsChartCardFeesChart)
