import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { useRouter } from 'next/router'
import React from 'react'

import PositionsTable from '@/app/components/common/PositionsTable'
import { DEFAULT_MARKET } from '@/app/constants/defaults'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'
import useTradeHistory from '@/app/hooks/position/useTradeHistory'
import getPagePath from '@/app/utils/getPagePath'

const TradeHistoryButton = withSuspense(() => {
  const history = useTradeHistory()
  return history.length > 0 ? (
    <Button ml="auto" variant="light" label="History →" href={getPagePath({ page: PageId.History })} />
  ) : null
})

const Header = () => (
  <Flex px={6} alignItems="center">
    <Text my={4} variant="heading">
      Open Positions
    </Text>
    <TradeHistoryButton />
  </Flex>
)

const PortfolioOpenPositionsCard = withSuspense(
  ({ ...marginProps }: MarginProps): CardElement => {
    const openPositions = useOpenPositions()
    const router = useRouter()
    return (
      <Card overflow="hidden" {...marginProps}>
        <CardBody noPadding>
          <Header />
          {openPositions.length > 0 ? (
            <PositionsTable
              positions={openPositions}
              onClick={position =>
                router.push(
                  getPagePath({
                    page: PageId.Position,
                    marketAddressOrName: position.marketName,
                    positionId: position.id,
                  })
                )
              }
            />
          ) : (
            <Box mx={6} mb={6}>
              <Text variant="secondary" color="secondaryText" mb={4}>
                You have no open positions
              </Text>
              <Button
                variant="primary"
                label="Start Trading"
                width={150}
                size="md"
                rightIcon={IconType.ArrowRight}
                href={getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET })}
              />
            </Box>
          )}
        </CardBody>
      </Card>
    )
  },
  ({ ...marginProps }) => (
    <Card {...marginProps} height={163}>
      <CardBody noPadding height="100%">
        <Header />
        <Center flexGrow={1}>
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default PortfolioOpenPositionsCard
