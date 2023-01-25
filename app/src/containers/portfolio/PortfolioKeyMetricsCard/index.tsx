import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { PortfolioMarketData } from '@/app/hooks/portfolio/usePortfolioPageData'

type Props = {
  marketData: PortfolioMarketData[]
}

const PortfolioKeyMetricsCard = ({ marketData }: Props) => {
  const openInterest = useMemo(() => marketData.reduce((sum, dat) => sum + dat.openInterest, 0), [marketData])
  const tradingFees = useMemo(() => marketData.reduce((sum, dat) => sum + dat.totalFees30D, 0), [marketData])
  const tradingVolume = useMemo(
    () => marketData.reduce((sum, dat) => sum + dat.totalNotionalVolume30D, 0),
    [marketData]
  )
  const tvl = useMemo(() => marketData.reduce((sum, dat) => sum + dat.tvl, 0), [marketData])

  return (
    <Card>
      <CardBody>
        <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gridGap: 3 }}>
          <LabelItem label="TVL" valueTextVariant="bodyLarge" value={formatTruncatedUSD(tvl)} />
          <LabelItem label="30D Volume" valueTextVariant="bodyLarge" value={formatTruncatedUSD(tradingVolume)} />
          <LabelItem label="30D Fees" valueTextVariant="bodyLarge" value={formatTruncatedUSD(tradingFees)} />
          <LabelItem label="Open Interest" valueTextVariant="bodyLarge" value={formatTruncatedUSD(openInterest)} />
        </Grid>
      </CardBody>
    </Card>
  )
}

export default PortfolioKeyMetricsCard
