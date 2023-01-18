import Box from '@lyra/ui/components/Box'
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
      {markets.map(({ market, spotPrice, spotPrice24HChange }) => (
        <ListItem
          href={getPagePath({
            page: PageId.Trade,
            network: market.lyra.network,
            marketAddressOrName: market.name,
          })}
          key={market.address}
          label={<MarketLabel market={market} />}
          rightContent={
            <Box textAlign="right">
              <Text variant="secondary">{formatUSD(spotPrice)}</Text>
              <Text variant="small" color={spotPrice24HChange >= 0 ? 'primaryText' : 'errorText'}>
                {formatPercentage(spotPrice24HChange)}
              </Text>
            </Box>
          }
        />
      ))}
    </List>
  )
}
export default PortfolioMarketsListMobile
