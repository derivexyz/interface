import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAggregateTVL from '@/app/hooks/portfolio/useAggregateTVL'
import useMarketsTableData from '@/app/hooks/portfolio/useMarketsTableData'

type Props = MarginProps

const TotalValueLockedText = withSuspense(
  () => {
    const totalValueLocked = useAggregateTVL()
    return <Text variant="bodyLarge">{formatTruncatedUSD(totalValueLocked)}</Text>
  },
  () => <TextShimmer variant="bodyLarge" />
)

const TradingVolumeText = withSuspense(
  () => {
    const data = useMarketsTableData()
    const tradingVolume = useMemo(() => data.reduce((sum, dat) => sum + dat.totalNotionalVolume30D, 0), [data])
    return <Text variant="bodyLarge">{formatTruncatedUSD(tradingVolume)}</Text>
  },
  () => <TextShimmer variant="bodyLarge" />
)

const TradingFeesText = withSuspense(
  () => {
    const data = useMarketsTableData()
    const tradingFees = useMemo(() => data.reduce((sum, dat) => sum + dat.totalFees30D, 0), [data])
    return <Text variant="bodyLarge">{formatTruncatedUSD(tradingFees)}</Text>
  },
  () => <TextShimmer variant="bodyLarge" />
)

const OpenInterestText = withSuspense(
  () => {
    const data = useMarketsTableData()
    const openInterest = useMemo(() => data.reduce((sum, dat) => sum + dat.openInterest, 0), [data])
    return <Text variant="bodyLarge">{formatTruncatedUSD(openInterest)}</Text>
  },
  () => <TextShimmer variant="bodyLarge" />
)

const PortfolioKeyMetricsCard = ({ ...styleProps }: Props) => {
  return (
    <Card {...styleProps}>
      <CardBody>
        <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gridGap: 3 }}>
          <LabelItem label="TVL" value={<TotalValueLockedText />} />
          <LabelItem label="30D Volume" value={<TradingVolumeText />} />
          <LabelItem label="30D Fees" value={<TradingFeesText />} />
          <LabelItem label="Open Interest" value={<OpenInterestText />} />
        </Grid>
      </CardBody>
    </Card>
  )
}

export default PortfolioKeyMetricsCard
