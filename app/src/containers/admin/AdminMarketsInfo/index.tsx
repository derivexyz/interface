import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  markets: Market[]
}

const AdminMarketsInfo = ({ markets }: Props) => {
  return (
    <Card>
      <CardBody noPadding>
        <Text m={6} variant="cardHeading">
          Markets
        </Text>
        <List>
          {markets.map(market => (
            <ListItem
              key={market.address}
              href={getPagePath({
                page: PageId.Admin,
                network: market.lyra.network,
                marketAddressOrName: market.name,
              })}
              icon={<MarketImage ml={3} market={market} />}
              label={getMarketDisplayName(market)}
              sublabel={`${market.liveBoards().length} boards`}
            />
          ))}
        </List>
      </CardBody>
    </Card>
  )
}

export default AdminMarketsInfo
