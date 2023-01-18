import Box from '@lyra/ui/components/Box'
import List, { ListElement } from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import formatDuration from '@lyra/ui/utils/formatDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import MarketLabelProgress from '../MarketLabelProgress'
import VaultsCircuitBreakerToken from '../VaultsCircuitBreakerToken'
import { VaultsPendingDepositsTableOrListProps } from '.'

const VaultsPendingDepositsListMobile = ({
  deposits,
  onClick,
  ...styleProps
}: VaultsPendingDepositsTableOrListProps): ListElement => {
  return (
    <List {...styleProps}>
      {deposits.map(deposit => {
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const market = deposit.market()
        const duration = market.depositDelay
        const startTimestamp = deposit.depositRequestedTimestamp
        const progressDuration = Math.min(Math.max(currentTimestamp - startTimestamp, 0), duration)
        const progress = duration > 0 ? progressDuration / duration : 0
        const delayReason = deposit.delayReason
        return (
          <ListItem
            key={`${deposit.queueId}-${market.address}`}
            label={<MarketLabelProgress market={market} progress={progress} color="primaryText" />}
            onClick={onClick}
            rightContent={
              <Box textAlign="right">
                <Text variant="secondary">
                  {formatUSD(deposit.value)} {market.quoteToken.symbol}
                </Text>
                {!delayReason ? (
                  <Text variant="small" color="secondaryText">
                    in {formatDuration(Math.max(0, deposit.depositTimestamp - market.block.timestamp))}
                  </Text>
                ) : (
                  <VaultsCircuitBreakerToken delayReason={delayReason} />
                )}
              </Box>
            }
          />
        )
      })}
    </List>
  )
}

export default VaultsPendingDepositsListMobile
