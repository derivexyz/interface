import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import PortfolioAnnouncementCards from '@/app/components/portfolio/PortfolioAnnouncementCards'
import PortfolioBalanceCard from '@/app/containers/portfolio/PortfolioBalanceCard'
import PortfolioBalanceCollapsedHeader from '@/app/containers/portfolio/PortfolioBalanceCollapsedHeader'
import PortfolioKeyMetricsCard from '@/app/containers/portfolio/PortfolioKeyMetricsCard'
import PortfolioOpenPositionsCard from '@/app/containers/portfolio/PortfolioOpenPositionsCard'

import PortfolioMarketsCard from '../../containers/portfolio/PortfolioMarketsCard'
import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

const PortfolioPageHelper = (): JSX.Element => {
  const isMobile = useIsMobile()
  return (
    <Layout mobileCollapsedHeader={isMobile ? <PortfolioBalanceCollapsedHeader /> : null}>
      <LayoutGrid>
        <PortfolioBalanceCard />
        <PortfolioAnnouncementCards />
        <PortfolioOpenPositionsCard />
        <PortfolioMarketsCard />
        <PortfolioKeyMetricsCard />
      </LayoutGrid>
    </Layout>
  )
}

export default PortfolioPageHelper
