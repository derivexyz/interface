import React from 'react'

import PortfolioAnnouncementCards from '@/app/components/portfolio/PortfolioAnnouncementCards'
import PortfolioKeyMetricsCard from '@/app/containers/portfolio/PortfolioKeyMetricsCard'
import PortfolioOpenPositionsCard from '@/app/containers/portfolio/PortfolioOpenPositionsCard'

import PortfolioMarketsCard from '../../containers/portfolio/PortfolioMarketsCard'
import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const PortfolioPageHelper = (): JSX.Element => {
  return (
    <Page header="Portfolio" mobileCollapsedHeader="Portfolio">
      <PageGrid>
        <PortfolioAnnouncementCards />
        <PortfolioOpenPositionsCard />
        <PortfolioKeyMetricsCard />
        <PortfolioMarketsCard />
      </PageGrid>
    </Page>
  )
}

export default PortfolioPageHelper
