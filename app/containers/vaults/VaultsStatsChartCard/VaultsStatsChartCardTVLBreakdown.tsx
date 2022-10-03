import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultTVLHistory, { TVLSnapshot } from '@/app/hooks/vaults/useVaultTVLHistory'

type Props = {
  hoverData: TVLSnapshot | null
  marketAddressOrName: string
  period: ChartPeriod
} & MarginProps &
  PaddingProps

const VaultsStatsChartCardTVLBreakdown = withSuspense(
  ({ hoverData, marketAddressOrName, period, ...styleProps }: Props) => {
    const vaultHistoryTVL = useVaultTVLHistory(marketAddressOrName, period)
    const isMobile = useIsMobile()
    const vaultBalanceTVL = useMemo(() => vaultHistoryTVL[vaultHistoryTVL.length - 1], [vaultHistoryTVL])
    const total = hoverData?.total ?? vaultBalanceTVL?.total
    const utilization = hoverData?.utilization ?? vaultBalanceTVL.utilization
    const pendingDeposits = hoverData?.deposits ?? vaultBalanceTVL.deposits
    const earliestHistory = vaultHistoryTVL[0]
    const earliestTotal = earliestHistory.total ?? 0
    const pctChangeTotal = earliestTotal == 0 ? 0 : (total - earliestTotal) / earliestTotal
    return (
      <Box {...styleProps}>
        <Text variant="heading">{formatTruncatedUSD(total)}</Text>
        <Text variant="small" color={pctChangeTotal >= 0 ? 'primaryText' : 'errorText'}>
          {formatPercentage(pctChangeTotal)}
        </Text>
        {!isMobile ? (
          <>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Pending Deposits
              </Text>
              <Text variant="bodyMedium" color="text">
                {formatTruncatedUSD(pendingDeposits)}
              </Text>
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Utilization
              </Text>
              <Text variant="bodyMedium" color="text">
                {formatPercentage(utilization, true)}
              </Text>
            </Box>
          </>
        ) : null}
      </Box>
    )
  },
  ({ hoverData, marketAddressOrName, period, ...styleProps }) => {
    const isMobile = useIsMobile()
    return (
      <Box flexDirection="column" {...styleProps}>
        <Box>
          <TextShimmer variant="heading" width={100} />
          <TextShimmer variant="small" width={80} />
        </Box>
        {!isMobile ? (
          <>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Pending Deposits
              </Text>
              <TextShimmer variant="body" width={80} />
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Utilization
              </Text>
              <TextShimmer variant="body" width={80} />
            </Box>
          </>
        ) : null}
      </Box>
    )
  }
)

export default VaultsStatsChartCardTVLBreakdown
