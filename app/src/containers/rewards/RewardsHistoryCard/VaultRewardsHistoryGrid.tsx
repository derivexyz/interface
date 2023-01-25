import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { AccountRewardEpoch, Market } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import formatTokenName from '@/app/utils/formatTokenName'

import VaultAPYTooltip from '../../../components/common/VaultAPYTooltip'

type Props = {
  accountRewardEpoch: AccountRewardEpoch
} & MarginProps

type RowProps = {
  accountRewardEpoch: AccountRewardEpoch
  market: Market
}

const VaultRewardsHistoryMarketRow = ({ accountRewardEpoch, market }: RowProps) => {
  const marketName = market.name
  const marketAddress = market.address
  const vaultTokens = accountRewardEpoch ? accountRewardEpoch.vaultTokenBalance(marketAddress) : 0
  const { op: opRewards, lyra: lyraRewards } = accountRewardEpoch.vaultRewards(marketAddress)
  const { op: opApy, lyra: lyraApy } = accountRewardEpoch.vaultApy(marketAddress)
  const apyMultiplier = accountRewardEpoch.vaultApyMultiplier(marketAddress)
  const stakedLyraBalance = accountRewardEpoch.stakedLyraBalance

  return (
    <Grid mb={4} sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 4, gridRowGap: 6 }}>
      <Flex flexDirection="column" justifyContent="space-between">
        <Text variant="secondary" color="secondaryText" mb={2}>
          Vault
        </Text>
        <Flex alignItems="flex-end">
          <MarketImage market={market} />
          <Text variant="secondary" ml={2} color="secondaryText">
            {formatTokenName(market.baseToken)}
          </Text>
        </Flex>
      </Flex>
      {lyraApy > 0 ? (
        <Flex flexDirection="column" justifyContent="space-between">
          <Text variant="secondary" color="secondaryText" mb={2}>
            stkLYRA Rewards
          </Text>
          <TokenAmountText
            variant="secondary"
            color="secondaryText"
            tokenNameOrAddress="stkLyra"
            amount={lyraRewards}
          />
        </Flex>
      ) : null}
      {opApy > 0 ? (
        <Flex flexDirection="column" justifyContent="space-between">
          <Text variant="secondary" color="secondaryText" mb={2}>
            OP Rewards
          </Text>
          <TokenAmountText variant="secondary" color="secondaryText" tokenNameOrAddress="op" amount={opRewards} />
        </Flex>
      ) : null}
      <Flex flexDirection="column" justifyContent="space-between">
        <Text variant="secondary" color="secondaryText" mb={2}>
          Avg. LP Tokens
        </Text>
        <Text variant="secondary">{formatNumber(vaultTokens)}</Text>
      </Flex>
      <Flex flexDirection="column" justifyContent="space-between">
        <Text variant="secondary" color="secondaryText" mb={2}>
          Avg. APY
        </Text>
        <VaultAPYTooltip
          marketName={marketName}
          opApy={opApy}
          lyraApy={lyraApy}
          apyMultiplier={apyMultiplier}
          stakedLyraBalance={stakedLyraBalance}
        >
          <Text variant="secondary" color="primaryText">
            {formatPercentage(opApy + lyraApy, true)} {apyMultiplier > 1 ? `(${formatNumber(apyMultiplier)}x)` : ''}
          </Text>
        </VaultAPYTooltip>
      </Flex>
    </Grid>
  )
}

const VaultRewardsHistoryGrid = ({ accountRewardEpoch, ...marginProps }: Props) => {
  const markets = accountRewardEpoch.globalEpoch.markets
  const marketsWithRewards = useMemo(() => {
    return markets.filter(market => {
      const vaultRewards = accountRewardEpoch.vaultRewards(market.address)
      return vaultRewards.lyra > 0 || vaultRewards.op > 0
    })
  }, [accountRewardEpoch, markets])
  if (marketsWithRewards.length === 0) {
    return null
  }
  return (
    <Box {...marginProps}>
      <Text variant="heading2" mb={4}>
        Vault Rewards
      </Text>
      {marketsWithRewards.map(market => (
        <VaultRewardsHistoryMarketRow key={market.name} accountRewardEpoch={accountRewardEpoch} market={market} />
      ))}
    </Box>
  )
}

export default VaultRewardsHistoryGrid
