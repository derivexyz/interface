import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'
import { useState } from 'react'

import ChartIntervalSelector from '@/app/components/common/ChartIntervalSelector'
import { ChartInterval } from '@/app/constants/chart'
import { PortfolioOverview } from '@/app/hooks/portfolio/usePortfolioPageData'

import PortfolioChartOverviewSection from './PortfolioChartOverviewSection'
import PortfolioProfitLossChart from './PortfolioProfitLossChart'

type Props = {
  portfolioOverview: PortfolioOverview
}

const PositionProfitLossCard = ({ portfolioOverview }: Props) => {
  const isMobile = useIsMobile()
  const [interval, setInterval] = useState<ChartInterval>(ChartInterval.OneMonth)

  return (
    <Card flexDirection={['column', 'row']}>
      <PortfolioChartOverviewSection portfolioOverview={portfolioOverview} />
      <CardSeparator isVertical />
      <CardSection flexGrow={[0, 1]} sx={{ position: 'relative' }}>
        <Flex sx={!isMobile ? { position: 'absolute', right: 6, top: 6 } : null}>
          <ChartIntervalSelector
            ml={['auto', null]}
            intervals={[
              ChartInterval.OneMonth,
              ChartInterval.ThreeMonths,
              ChartInterval.SixMonths,
              ChartInterval.AllTime,
            ]}
            selectedInterval={interval}
            onChangeInterval={setInterval}
          />
        </Flex>
        <PortfolioProfitLossChart interval={interval} />
      </CardSection>
    </Card>
  )
}

export default PositionProfitLossCard
