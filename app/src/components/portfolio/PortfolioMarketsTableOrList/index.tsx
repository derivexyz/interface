import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import { PortfolioMarketData } from '@/app/hooks/portfolio/usePortfolioPageData'

import PortfolioMarketsListMobile from './PortfolioMarketsListMobile'
import PortfolioMarketsTableDesktop from './PortfolioMarketsTableDesktop'

export type PortfolioMarketsTableOrListProps = {
  marketData: PortfolioMarketData[]
} & MarginProps &
  LayoutProps &
  PaddingProps

const PortfolioMarketsTableOrList = (props: PortfolioMarketsTableOrListProps): JSX.Element => {
  const isMobile = useIsMobile()
  return isMobile ? <PortfolioMarketsListMobile {...props} /> : <PortfolioMarketsTableDesktop {...props} />
}

export default PortfolioMarketsTableOrList
