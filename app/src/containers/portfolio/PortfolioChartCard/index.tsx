import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import React from 'react'

import { ChartInterval } from '@/app/constants/chart'
import { PORTFOLIO_CARD_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import { PortfolioOverview } from '@/app/hooks/portfolio/usePortfolioPageData'
import useProfitLossHistory from '@/app/hooks/portfolio/useProfitLossHistory'

import PortfolioOnboardingCard from './PortfolioOnboardingCard'
import PositionProfitLossCard from './PositionProfitLossCard'

type Props = {
  portfolioOverview: PortfolioOverview
}

const PortfolioChartCard = withSuspense(
  ({ portfolioOverview }: Props) => {
    const pnlHistory = useProfitLossHistory(ChartInterval.AllTime)
    return pnlHistory.length < 1 ? (
      <PortfolioOnboardingCard />
    ) : (
      <PositionProfitLossCard portfolioOverview={portfolioOverview} />
    )
  },
  () => (
    <Card height={PORTFOLIO_CARD_HEIGHT}>
      <CardBody height="100%">
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default PortfolioChartCard
