import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import List, { ListElement } from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React from 'react'

import MarketLabel from '../MarketLabel'
import VaultAPYTooltip from '../VaultAPYTooltip'
import { VaultsMyLiquidityBalancesTableOrListProps } from '.'

const VaultsMyLiquidityBalancesListMobile = ({
  vaultBalances,
  onClick,
  ...styleProps
}: VaultsMyLiquidityBalancesTableOrListProps): ListElement => {
  return (
    <List {...styleProps}>
      {vaultBalances.map(vaultBalance => {
        const { balance, myApy, myApyMultiplier } = vaultBalance
        return (
          <ListItem
            key={balance.market.address}
            label={<MarketLabel marketName={balance.market.name} />}
            rightContent={
              <Flex alignItems="center">
                <Box>
                  <Text textAlign="right" variant="secondary">
                    {formatTruncatedUSD(balance.value)} Bal.
                  </Text>
                  <VaultAPYTooltip marketName={balance.market.name} opApy={myApy.op} lyraApy={myApy.lyra}>
                    <Text ml={1} variant="small" color="primaryText">
                      {formatPercentage(myApy.total, true)} APY{' '}
                      {myApyMultiplier > 1 ? `(${formatNumber(myApyMultiplier)}x)` : ''}
                    </Text>
                  </VaultAPYTooltip>
                </Box>
                <IconButton ml={4} icon={IconType.ArrowRight} />
              </Flex>
            }
            onClick={() => {
              if (onClick) {
                onClick(vaultBalance)
              }
            }}
          />
        )
      })}
    </List>
  )
}

export default VaultsMyLiquidityBalancesListMobile
