import Box from '@lyra/ui/components/Box'
import List, { ListElement } from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
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
        const duration = deposit.__market.depositDelay
        const startTimestamp = deposit.depositRequestedTimestamp
        const progressDuration = Math.min(Math.max(currentTimestamp - startTimestamp, 0), duration)
        const progressPct = duration > 0 ? progressDuration / duration : 0
        const timeToEntry = duration - progressDuration
        const delayReason = deposit.delayReason
        return (
          <ListItem
            key={`${deposit.queueId}-${market.address}`}
            label={<MarketLabelProgress marketName={market.name} progress={progressPct} color="primaryText" />}
            onClick={onClick ? () => onClick(deposit) : undefined}
            rightContent={
              <Box textAlign="right">
                <Text variant="secondary">{formatUSD(deposit.value)}</Text>
                {timeToEntry && !delayReason ? (
                  <Text variant="secondary">{formatTruncatedDuration(timeToEntry)}</Text>
                ) : null}
                {delayReason ? <VaultsCircuitBreakerToken delayReason={delayReason} /> : null}
              </Box>
            }
          />
        )
      })}
    </List>
  )
}

export default VaultsPendingDepositsListMobile
