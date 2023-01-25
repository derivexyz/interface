import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import usePortfolioPageData from '../hooks/portfolio/usePortfolioPageData'
import PortfolioPageHelper from '../page_helpers/PortfolioPageHelper'

// /portfolio
const PortfolioPage = withSuspense(
  () => {
    const { marketData, openPositions } = usePortfolioPageData()
    return <PortfolioPageHelper marketData={marketData} openPositions={openPositions} />
  },
  () => <PageLoading />
)

export default PortfolioPage
