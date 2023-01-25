import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import PortfolioMarketsTableOrList from '@/app/components/portfolio/PortfolioMarketsTableOrList'
import { PortfolioMarketData } from '@/app/hooks/portfolio/usePortfolioPageData'

type Props = {
  marketData: PortfolioMarketData[]
}

const PortfolioMarketsCard = ({ marketData }: Props): CardElement => {
  return (
    <Card overflow="hidden">
      <CardBody noPadding>
        <Text mx={6} my={4} variant="heading">
          Markets
        </Text>
        {marketData.length > 0 ? (
          <PortfolioMarketsTableOrList marketData={marketData} />
        ) : (
          <Text mx={6} my={4} variant="secondary" color="secondaryText">
            No markets
          </Text>
        )}
      </CardBody>
    </Card>
  )
}

export default PortfolioMarketsCard
