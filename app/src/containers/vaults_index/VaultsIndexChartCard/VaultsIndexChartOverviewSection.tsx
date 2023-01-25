import Box from '@lyra/ui/components/Box'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import LabelItemShimmer from '@/app/components/common/LabelItem/LabelItemShimmer'
import { SECONDS_IN_MONTH } from '@/app/constants/time'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAggregateVaultStats from '@/app/hooks/vaults/useVaultsAggregatedStats'

const VaultsIndexChartOverviewSection = withSuspense(
  () => {
    const vaultStats = useAggregateVaultStats(SECONDS_IN_MONTH)
    if (!vaultStats) {
      return null
    }

    const { tvl, tvlChange } = vaultStats
    const { totalNotionalVolume, totalNotionalVolumeChange, totalFees, openInterest } = vaultStats

    return (
      <CardSection width={['100%', 200]}>
        <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
          <LabelItem
            noPadding
            label="TVL"
            valueTextVariant="bodyLarge"
            value={
              <Box>
                <Text variant="bodyLarge" color="text">
                  {formatTruncatedUSD(tvl)}
                </Text>
                <Text
                  variant="small"
                  color={tvlChange ? (tvlChange > 0 ? 'primaryText' : 'errorText') : 'secondaryText'}
                >
                  {tvlChange ? formatPercentage(tvlChange) : '-'}
                </Text>
              </Box>
            }
          />
          <LabelItem
            noPadding
            label="30D Volume"
            value={
              <Box>
                <Text variant="bodyLarge" color="text">
                  {formatTruncatedUSD(totalNotionalVolume)}
                </Text>
                <Text
                  variant="small"
                  color={
                    totalNotionalVolumeChange
                      ? totalNotionalVolumeChange > 0
                        ? 'primaryText'
                        : 'errorText'
                      : 'secondaryText'
                  }
                >
                  {totalNotionalVolumeChange ? formatPercentage(totalNotionalVolumeChange) : '-'}
                </Text>
              </Box>
            }
          />
          <LabelItem noPadding label="30D Fees" valueTextVariant="bodyLarge" value={formatTruncatedUSD(totalFees)} />
          <LabelItem
            noPadding
            label="Open Interest"
            valueTextVariant="bodyLarge"
            value={formatTruncatedUSD(openInterest)}
          />
        </Grid>
      </CardSection>
    )
  },
  () => (
    <CardSection width={['100%', 200]}>
      <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
        <LabelItemShimmer
          noPadding
          label="TVL"
          value={
            <Box>
              <TextShimmer variant="bodyLarge" width={100} />
              <TextShimmer variant="small" width={80} />
            </Box>
          }
        />
        <LabelItemShimmer
          noPadding
          label="30D Volume"
          value={
            <Box>
              <TextShimmer variant="bodyLarge" width={100} />
              <TextShimmer variant="small" width={80} />
            </Box>
          }
        />
        <LabelItemShimmer noPadding label="30D Fees" valueTextVariant="bodyLarge" />
        <LabelItemShimmer noPadding label="Open Interest" valueTextVariant="bodyLarge" />
      </Grid>
    </CardSection>
  )
)

export default VaultsIndexChartOverviewSection
