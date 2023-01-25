import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

import PortfolioAnnouncementCards from '@/app/components/portfolio/PortfolioAnnouncementCards'
import PortfolioKeyMetricsCard from '@/app/containers/portfolio/PortfolioKeyMetricsCard'
import PortfolioOpenPositionsCard from '@/app/containers/portfolio/PortfolioOpenPositionsCard'
import { PortfolioMarketData } from '@/app/hooks/portfolio/usePortfolioPageData'

import PortfolioMarketsCard from '../../containers/portfolio/PortfolioMarketsCard'
import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  marketData: PortfolioMarketData[]
  openPositions: Position[]
}

const PortfolioPageHelper = ({ marketData, openPositions }: Props): JSX.Element => {
  return (
    <Page header="Portfolio" mobileCollapsedHeader="Portfolio">
      <PageGrid>
        <PortfolioAnnouncementCards />
        <PortfolioOpenPositionsCard openPositions={openPositions} />
        <PortfolioKeyMetricsCard marketData={marketData} />
        <PortfolioMarketsCard marketData={marketData} />
      </PageGrid>
    </Page>
  )
}

export default PortfolioPageHelper
