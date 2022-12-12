import Flex from '@lyra/ui/components/Flex'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

import MarketLabel from '../../common/MarketLabel'
import { PortfolioMarketsTableOrListProps } from '.'

const PortfolioMarketsListMobile = ({ markets }: PortfolioMarketsTableOrListProps) => {
  return (
    <List>
      {markets.map(({ market, spotPrice, spotPriceChange }) => (
        <ListItem
          href={getPagePath({ page: PageId.Trade, marketAddressOrName: market.name })}
          key={market.address}
          label={<MarketLabel marketName={market.name} />}
          rightContent={
            <Flex flexDirection="column">
              <Text variant="secondary">{formatUSD(spotPrice)}</Text>
              <Text variant="small" color={spotPriceChange >= 0 ? 'primaryText' : 'errorText'}>
                {formatPercentage(spotPriceChange)}
              </Text>
            </Flex>
          }
        />
      ))}
    </List>
  )
}
export default PortfolioMarketsListMobile
