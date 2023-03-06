import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch, Market } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import MarketImage from '@/app/components/common/MarketImage'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { UNIT, ZERO_BN } from '@/app/constants/bn'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import formatTokenName from '@/app/utils/formatTokenName'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import getUniqueRewardTokenAmounts from '@/app/utils/getUniqueRewardTokenAmounts'

type Props = {
  accountRewardEpoch?: AccountRewardEpoch | null
  globalRewardEpoch: GlobalRewardEpoch
  market: Market
}

const RewardsVaultsMarketCard = ({ accountRewardEpoch, globalRewardEpoch, market }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const minApy = globalRewardEpoch.minVaultApy(market.address)
  const userApy = accountRewardEpoch?.vaultApy(market.address) ?? minApy
  const { vaultRewards, liquidityTokenBalanceValue, maxRewardToken } = useMemo(() => {
    const emptyVaultRewards = globalRewardEpoch.totalVaultRewards(market.address).map(t => ({ ...t, amount: 0 }))
    const pendingVaultRewards = accountRewardEpoch?.vaultRewards(market.address) ?? emptyVaultRewards
    const claimableVaultRewards = accountRewardEpoch?.claimableVaultRewards(market.address) ?? emptyVaultRewards
    const vaultRewards = getUniqueRewardTokenAmounts([...pendingVaultRewards, ...claimableVaultRewards])
    const maxRewardToken = vaultRewards.reduce(
      (maxRewardToken, r) => (maxRewardToken.amount > r.amount ? maxRewardToken : r),
      vaultRewards[0]
    )

    const marketLiquidity = globalRewardEpoch.marketsLiquidity.find(marketLiquidity =>
      marketLiquidity.market.isEqual(market.address)
    )
    const liquidityTokenBalance = accountRewardEpoch?.vaultTokenBalances[market.baseToken.symbol].balance ?? ZERO_BN
    const liquidityTokenBalanceValue = marketLiquidity?.tokenPrice.mul(liquidityTokenBalance).div(UNIT) ?? ZERO_BN

    return {
      vaultRewards: getUniqueRewardTokenAmounts([...pendingVaultRewards, ...claimableVaultRewards]),
      maxRewardToken,
      liquidityTokenBalanceValue,
    }
  }, [accountRewardEpoch, globalRewardEpoch, market])

  return (
    <Card
      mb={4}
      onClick={() =>
        navigate(
          getPagePath({
            page: PageId.RewardsVaults,
            network: market.lyra.network,
            marketAddressOrName: market.name,
          })
        )
      }
      sx={{
        ':hover': {
          bg: 'cardNestedHover',
          cursor: 'pointer',
        },
        ':active': {
          bg: 'active',
          cursor: 'pointer',
        },
      }}
    >
      <CardBody>
        <Grid
          width="100%"
          sx={{
            gridTemplateColumns: REWARDS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            gridRowGap: 6,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <MarketImage market={market} />
            <Text ml={2} variant="bodyLarge">
              {formatTokenName(market.baseToken)} · {getNetworkDisplayName(market.lyra.network)}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Balance
                </Text>
                <Text variant="bodyLarge">{formatUSD(liquidityTokenBalanceValue, { minDps: 0 })}</Text>
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  APY
                </Text>
                {liquidityTokenBalanceValue.isZero() ? (
                  <Text variant="bodyLarge">
                    {formatAPYRange(minApy, globalRewardEpoch.maxVaultApy(market.address), { showSymbol: false })}
                  </Text>
                ) : (
                  <Text color="primaryText" variant="bodyLarge">
                    {formatAPY(userApy, { showSymbol: false })}
                  </Text>
                )}
              </Flex>
              <Flex ml="auto">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Rewards
                </Text>
                <RewardTokenAmounts
                  color={vaultRewards.some(t => t.amount > 0.001) ? 'primaryText' : 'text'}
                  variant="bodyLarge"
                  tokenAmounts={[maxRewardToken]}
                  hideTokenImages={true}
                />
              </Flex>
            </>
          ) : null}

          <Flex justifySelf="end">
            <IconButton
              icon={IconType.ArrowRight}
              href={getPagePath({
                page: PageId.RewardsVaults,
                network: market.lyra.network,
                marketAddressOrName: market.name,
              })}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default RewardsVaultsMarketCard
