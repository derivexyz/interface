import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useMemo } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultPNLHistory, { PNLSnapshot } from '@/app/hooks/vaults/useVaultPNLHistory'

type Props = {
  hoverData: PNLSnapshot | null
  marketAddressOrName: string
  period: ChartPeriod
} & MarginProps &
  PaddingProps

const VaultsStatsChartCardPNLBreakdown = withSuspense(
  ({ hoverData, marketAddressOrName, period, ...styleProps }: Props) => {
    const isMobile = useIsMobile()
    const vaultHistoryPNL = useVaultPNLHistory(marketAddressOrName, period)
    const vaultBalancePNL = useMemo(() => vaultHistoryPNL[vaultHistoryPNL.length - 1], [vaultHistoryPNL])
    const pnl = hoverData?.pnl ?? vaultBalancePNL.pnl
    const earliestHistory = vaultHistoryPNL[0]
    const earliestPNL = earliestHistory.pnl ?? 0
    const pctChangePNL = earliestPNL == 0 ? 0 : (pnl - earliestPNL) / earliestPNL
    return (
      <Box {...styleProps}>
        <Text variant="heading" color={pctChangePNL >= 0 ? 'primaryText' : 'errorText'}>
          {' '}
          {formatPercentage(pctChangePNL)}{' '}
        </Text>
        {!isMobile ? (
          <Box my={6}>
            <Text variant="secondary" color="secondaryText" mb={2}>
              Token Value
            </Text>
            <Text variant="bodyMedium">{formatUSD(pnl, { dps: 4 })}</Text>
          </Box>
        ) : null}
      </Box>
    )
  },
  ({ hoverData, marketAddressOrName, period, ...styleProps }) => {
    const isMobile = useIsMobile()
    return (
      <Box {...styleProps}>
        <TextShimmer variant="heading" width={100} />
        {!isMobile ? (
          <Box my={6}>
            <Text variant="secondary" color="secondaryText" mb={2}>
              Token Value
            </Text>
            <TextShimmer variant="bodyMedium" width={80} />
          </Box>
        ) : null}
      </Box>
    )
  }
)

export default VaultsStatsChartCardPNLBreakdown
