import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultFeesHistory, { FeesSnapshot } from '@/app/hooks/vaults/useVaultFeesHistory'

type Props = {
  hoverData: FeesSnapshot | null
  marketAddressOrName: string
  period: ChartPeriod
} & MarginProps &
  PaddingProps

const VaultsStatsChartCardFeesBreakdown = withSuspense(
  ({ hoverData, marketAddressOrName, period, ...styleProps }: Props) => {
    const vaultHistoryFees = useVaultFeesHistory(marketAddressOrName, period)

    const totalFees = useMemo(() => vaultHistoryFees.reduce((sum, v) => sum + v.fees, 0), [vaultHistoryFees])
    const totalOptionFees = useMemo(() => vaultHistoryFees.reduce((sum, v) => sum + v.optionFee, 0), [vaultHistoryFees])
    const totalSpotFees = useMemo(() => vaultHistoryFees.reduce((sum, v) => sum + v.spotFee, 0), [vaultHistoryFees])
    const totalVegaFees = useMemo(
      () => vaultHistoryFees.reduce((sum, v) => sum + v.vegaFee + v.varianceFee, 0),
      [vaultHistoryFees]
    )

    const fees = hoverData?.fees ?? totalFees
    const optionFee = hoverData?.optionFee ?? totalOptionFees
    const spotFee = hoverData?.spotFee ?? totalSpotFees
    const vegaFee = hoverData?.vegaFee ?? totalVegaFees
    const isMobile = useIsMobile()
    return (
      <Box {...styleProps}>
        <Text variant="heading">{formatTruncatedUSD(fees)}</Text>
        {!isMobile ? (
          <>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Option Fees
              </Text>
              <Text variant="secondary">{formatTruncatedUSD(optionFee)}</Text>
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Spot Fees
              </Text>
              <Text variant="secondary">{formatTruncatedUSD(spotFee)}</Text>
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Vega Fees
              </Text>
              <Text variant="secondary">{formatTruncatedUSD(vegaFee)}</Text>
            </Box>
          </>
        ) : null}
      </Box>
    )
  },
  ({ hoverData, marketAddressOrName, period, ...styleProps }) => {
    const isMobile = useIsMobile()
    return (
      <Flex flexDirection="column" {...styleProps}>
        <TextShimmer variant="heading" width={100} />
        {!isMobile ? (
          <>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Option Fees
              </Text>
              <TextShimmer variant="secondary" width={80} />
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Spot Fees
              </Text>
              <TextShimmer variant="secondary" width={80} />
            </Box>
            <Box mt={6}>
              <Text variant="secondary" color="secondaryText" mb={2}>
                Vega Fees
              </Text>
              <TextShimmer variant="secondary" width={80} />
            </Box>
          </>
        ) : null}
      </Flex>
    )
  }
)

export default VaultsStatsChartCardFeesBreakdown
