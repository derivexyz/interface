import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import useVaultsTVLHistory, { VaultsTVLSnapshot } from '@/app/hooks/vaults/useVaultsTVLHistory'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  hoverData: VaultsTVLSnapshot | null
  period: ChartPeriod
} & MarginProps &
  PaddingProps

const VaultsIndexTVLChartCardTitle = withSuspense(
  ({ hoverData, period, ...styleProps }: Props) => {
    const vaultHistoryTVL = useVaultsTVLHistory(period)
    const markets = useMarkets()
    const vaultBalanceTVL = useMemo(
      () => (vaultHistoryTVL.length > 0 ? vaultHistoryTVL[vaultHistoryTVL.length - 1] : null),
      [vaultHistoryTVL]
    )
    const fallbackTVL = useMemo(
      () => fromBigNumber(markets.reduce((sum, market) => sum.add(market.tvl), ZERO_BN)),
      [markets]
    )
    const total = hoverData?.total ?? vaultBalanceTVL?.total ?? fallbackTVL
    const earliestHistory = vaultHistoryTVL.length > 0 ? vaultHistoryTVL[0] : null
    const earliestTotal = earliestHistory?.total ?? 0
    const pctChangeTotal = earliestTotal > 0 ? (total - earliestTotal) / earliestTotal : 0
    return (
      <Box {...styleProps}>
        <Text variant="heading">TVL</Text>
        <Text variant="heading">{formatTruncatedUSD(total)}</Text>
        <Text variant="small" color={pctChangeTotal >= 0 ? 'primaryText' : 'errorText'}>
          {formatPercentage(pctChangeTotal)}
        </Text>
      </Box>
    )
  },
  ({ hoverData, period, ...styleProps }) => (
    <Box {...styleProps}>
      <Text variant="heading">TVL</Text>
      <TextShimmer variant="heading" />
      <TextShimmer variant="small" width={50} />
    </Box>
  )
)

export default VaultsIndexTVLChartCardTitle
