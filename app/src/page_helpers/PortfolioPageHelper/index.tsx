import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

import PortfolioAnnouncementCards from '@/app/components/portfolio/PortfolioAnnouncementCards'
import PortfolioChartCard from '@/app/containers/portfolio/PortfolioChartCard'
import PortfolioKeyMetricsCard from '@/app/containers/portfolio/PortfolioKeyMetricsCard'
import PortfolioOpenPositionsCard from '@/app/containers/portfolio/PortfolioOpenPositionsCard'
import { PortfolioMarketData, PortfolioOverview } from '@/app/hooks/portfolio/usePortfolioPageData'

import PortfolioMarketsCard from '../../containers/portfolio/PortfolioMarketsCard'
import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  marketData: PortfolioMarketData[]
  openPositions: Position[]
  portfolioOverview: PortfolioOverview
}

const PortfolioPageHelper = ({ marketData, openPositions, portfolioOverview }: Props): JSX.Element => {
  return (
    <Page header="Portfolio" mobileCollapsedHeader="Portfolio">
      <PageGrid>
        <PortfolioChartCard portfolioOverview={portfolioOverview} />
        <PortfolioAnnouncementCards />
        <PortfolioOpenPositionsCard openPositions={openPositions} />
        <PortfolioKeyMetricsCard marketData={marketData} />
        <PortfolioMarketsCard marketData={marketData} />
      </PageGrid>
    </Page>
  )
}

export default PortfolioPageHelper
