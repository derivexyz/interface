import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import PortfolioMarketsTableOrList from '@/app/components/portfolio/PortfolioMarketsTableOrList'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarketsTableData from '@/app/hooks/portfolio/useMarketsTableData'

const PortfolioMarketsCard = withSuspense(
  ({ ...marginProps }: MarginProps): CardElement => {
    const markets = useMarketsTableData()
    return (
      <Card {...marginProps} overflow="hidden">
        <CardBody noPadding>
          <Text mx={6} my={4} variant="heading">
            Markets
          </Text>
          {markets.length > 0 ? (
            <PortfolioMarketsTableOrList markets={markets} />
          ) : (
            <Text mx={6} my={4} variant="secondary" color="secondaryText">
              Failed to load markets
            </Text>
          )}
        </CardBody>
      </Card>
    )
  },
  ({ ...marginProps }) => (
    <Card {...marginProps}>
      <CardBody noPadding>
        <Text mx={6} my={4} variant="heading">
          Markets
        </Text>
        <Center height={200}>
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default PortfolioMarketsCard
