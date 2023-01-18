import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'

const AdminMarketsInfo = withSuspense(
  () => {
    const markets = useMarkets()
    return (
      <Card mx={8} mt={4}>
        <CardBody noPadding>
          <Box px={4} pt={4}>
            <Text variant="heading">Markets</Text>
          </Box>
          <List mt={2}>
            {markets.map(market => (
              <ListItem
                key={market.address}
                href={getPagePath({
                  page: PageId.AdminMarket,
                  network: market.lyra.network,
                  marketAddressOrName: market.name,
                })}
                icon={<MarketImage market={market} mr={2} />}
                label={getMarketDisplayName(market)}
                sublabel={`${market.liveBoards().length} boards`}
              />
            ))}
          </List>
        </CardBody>
      </Card>
    )
  },
  () => (
    <Card mx={8} mt={4}>
      <CardBody noPadding>
        <Box px={4} pt={4}>
          <Text variant="heading">Markets</Text>
        </Box>
        <Center pb={4} height="100%" width="100%">
          <Spinner mt={2} />
        </Center>
      </CardBody>
    </Card>
  )
)

export default AdminMarketsInfo
