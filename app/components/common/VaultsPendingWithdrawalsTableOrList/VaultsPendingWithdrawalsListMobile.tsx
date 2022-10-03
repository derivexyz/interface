import Box from '@lyra/ui/components/Box'
import List, { ListElement } from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import React from 'react'

import MarketLabelProgress from '../MarketLabelProgress'
import VaultsCircuitBreakerToken from '../VaultsCircuitBreakerToken'
import { VaultsPendingWithdrawalsTableOrListProps } from '.'

const VaultsPendingWithdrawalsListMobile = ({
  withdrawals,
  onClick,
  ...styleProps
}: VaultsPendingWithdrawalsTableOrListProps): ListElement => {
  return (
    <List {...styleProps}>
      {withdrawals.map(withdrawal => {
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const market = withdrawal.market()
        const duration = withdrawal.__market.withdrawalDelay
        const startTimestamp = withdrawal.withdrawalRequestedTimestamp
        const progressDuration = Math.min(Math.max(currentTimestamp - startTimestamp, 0), duration)
        const progressPct = duration > 0 ? progressDuration / duration : 0
        const timeToExit = duration - progressDuration
        const delayReason = withdrawal.delayReason
        return (
          <ListItem
            key={`${withdrawal.queueId}-${market.address}`}
            label={<MarketLabelProgress marketName={market.name} progress={progressPct} color="error" />}
            onClick={onClick ? () => onClick(withdrawal) : undefined}
            rightContent={
              <Box textAlign="right">
                <Text variant="secondary">{formatNumber(withdrawal.balance)} Tokens</Text>
                {timeToExit && !delayReason ? (
                  <Text variant="secondary">{formatTruncatedDuration(timeToExit)}</Text>
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

export default VaultsPendingWithdrawalsListMobile
