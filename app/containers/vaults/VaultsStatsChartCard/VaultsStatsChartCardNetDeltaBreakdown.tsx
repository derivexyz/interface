import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultNetGreeksHistory, { NetGreeksSnapshot } from '@/app/hooks/vaults/useVaultNetGreeksHistory'

type Props = {
  hoverData: NetGreeksSnapshot | null
  marketAddressOrName: string
  period: ChartPeriod
} & MarginProps &
  PaddingProps

const VaultsStatsChartCardNetDeltaBreakdown = withSuspense(
  ({ hoverData, marketAddressOrName, period, ...styleProps }: Props) => {
    const netGreeksHistory = useVaultNetGreeksHistory(marketAddressOrName, period)
    const lastNetGreeksSnapshot = netGreeksHistory[netGreeksHistory.length - 1]
    const netDelta = hoverData?.netDelta ?? lastNetGreeksSnapshot?.netDelta
    const poolNetDelta = hoverData?.poolNetDelta ?? lastNetGreeksSnapshot?.poolNetDelta
    const hedgerNetDelta = hoverData?.hedgerNetDelta ?? lastNetGreeksSnapshot?.hedgerNetDelta
    const netStdVega = hoverData?.netStdVega ?? lastNetGreeksSnapshot?.netStdVega
    const isMobile = useIsMobile()
    return (
      <Box {...styleProps}>
        <Text variant="heading">
          {netDelta > 0 ? '+' : ''}
          {formatNumber(netDelta, { minDps: 3 })}
        </Text>
        {!isMobile ? (
          <>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Pool Net Delta
              </Text>
              <Text variant="secondary">
                {poolNetDelta > 0 ? '+' : ''}
                {formatNumber(poolNetDelta, { minDps: 3 })}
              </Text>
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Hedger Net Delta
              </Text>
              <Text variant="secondary">
                {hedgerNetDelta > 0 ? '+' : ''}
                {formatNumber(hedgerNetDelta, { minDps: 3 })}
              </Text>
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Net Std Vega
              </Text>
              <Text variant="secondary">
                {netStdVega > 0 ? '+' : ''}
                {formatNumber(netStdVega, { minDps: 3 })}
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
      <Box {...styleProps}>
        <TextShimmer variant="heading" width={100} />
        {!isMobile ? (
          <>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Pool Net Delta
              </Text>
              <TextShimmer variant="secondary" width={80} />
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Hedger Net Delta
              </Text>
              <TextShimmer variant="secondary" width={80} />
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Net Std Vega
              </Text>
              <TextShimmer variant="secondary" width={80} />
            </Box>
          </>
        ) : null}
      </Box>
    )
  }
)

export default VaultsStatsChartCardNetDeltaBreakdown
