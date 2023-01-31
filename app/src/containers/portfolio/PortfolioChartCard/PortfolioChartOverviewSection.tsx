import Box from '@lyra/ui/components/Box'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import LabelItemShimmer from '@/app/components/common/LabelItem/LabelItemShimmer'
import { ChartInterval } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import { PortfolioOverview } from '@/app/hooks/portfolio/usePortfolioPageData'
import useProfitLossHistory from '@/app/hooks/portfolio/useProfitLossHistory'

type Props = {
  portfolioOverview: PortfolioOverview
}

const PortfolioChartOverviewSection = withSuspense(
  ({ portfolioOverview }: Props) => {
    const { unrealizedPnl, netDelta, netVega, lockedCollateral } = portfolioOverview
    const pnlHistory = useProfitLossHistory(ChartInterval.OneMonth)
    const latestPnl = pnlHistory.length ? pnlHistory[pnlHistory.length - 1].livePnl : 0

    return (
      <CardSection width={['100%', 200]}>
        <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
          <LabelItem
            noPadding
            label="30D Profit / Loss"
            valueTextVariant="bodyLarge"
            value={
              <Box>
                <Text variant="bodyLarge" color="text">
                  {latestPnl ? formatUSD(latestPnl, { showSign: true }) : '-'}
                </Text>
              </Box>
            }
          />
          <LabelItem
            noPadding
            label="Unrealized P/L"
            valueTextVariant="bodyLarge"
            value={
              <Box>
                <Text variant="bodyLarge" color="text">
                  {formatUSD(unrealizedPnl, { showSign: true })}
                </Text>
              </Box>
            }
          />
          {netDelta && netVega ? (
            <>
              {lockedCollateral > 0 ? (
                <LabelItem
                  noPadding
                  label="Locked Collateral"
                  value={
                    <Box>
                      <Text variant="bodyLarge" color="text">
                        {formatUSD(lockedCollateral)}
                      </Text>
                    </Box>
                  }
                />
              ) : null}
              <LabelItem
                noPadding
                label="Net Delta"
                value={
                  <Box>
                    <Text variant="bodyLarge" color="text">
                      {formatTruncatedNumber(netDelta)}
                    </Text>
                  </Box>
                }
              />
              {lockedCollateral === 0 ? (
                <LabelItem
                  noPadding
                  label="Net Vega"
                  valueTextVariant="bodyLarge"
                  value={
                    <Box>
                      <Text variant="bodyLarge" color="text">
                        {formatTruncatedNumber(netVega)}
                      </Text>
                    </Box>
                  }
                />
              ) : null}
            </>
          ) : null}
        </Grid>
      </CardSection>
    )
  },
  () => (
    <CardSection width={['100%', 200]}>
      <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
        <LabelItemShimmer
          noPadding
          label="Profit / Loss"
          value={
            <Box>
              <TextShimmer variant="bodyLarge" width={100} />
              <TextShimmer variant="small" width={80} />
            </Box>
          }
        />
        <LabelItemShimmer
          noPadding
          label="Unrealized P/L"
          value={
            <Box>
              <TextShimmer variant="bodyLarge" width={100} />
              <TextShimmer variant="small" width={80} />
            </Box>
          }
        />
      </Grid>
    </CardSection>
  )
)

export default PortfolioChartOverviewSection
