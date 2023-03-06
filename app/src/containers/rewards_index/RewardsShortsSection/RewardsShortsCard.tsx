import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch, Network, RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import NetworkImage from '@/app/components/common/NetworkImage'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { ZERO_BN } from '@/app/constants/bn'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import getUniqueRewardTokenAmounts from '@/app/utils/getUniqueRewardTokenAmounts'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  accountRewardEpoch?: AccountRewardEpoch | null
} & MarginProps

const ShortCollateralValueText = withSuspense(
  ({ globalRewardEpoch }: { globalRewardEpoch: GlobalRewardEpoch }) => {
    const positions = usePositionHistory(true, globalRewardEpoch.lyra.network)
    const shortPositions = useMemo(
      () =>
        positions
          // Consider open positions or positions closed this epoch
          .filter(p => !p.isLong && (!p.closeTimestamp || p.closeTimestamp > globalRewardEpoch.startTimestamp)),

      [globalRewardEpoch, positions]
    )
    const shortCollateralValue = useMemo(
      () => shortPositions.reduce((sum, position) => sum.add(position.collateral?.value ?? ZERO_BN), ZERO_BN),
      [shortPositions]
    )
    return <Text variant="bodyLarge">{formatUSD(shortCollateralValue, { maxDps: 2 })}</Text>
  },
  () => <TextShimmer variant="bodyLarge" width={40} />
)

const ShortCollateralYieldText = withSuspense(
  ({ globalRewardEpoch }: { globalRewardEpoch: GlobalRewardEpoch }) => {
    const positions = usePositionHistory(true, globalRewardEpoch.lyra.network)
    const shortPositions = useMemo(
      () =>
        // Consider open positions or positions closed this epoch
        positions.filter(p => !p.isLong && (!p.closeTimestamp || p.closeTimestamp > globalRewardEpoch.startTimestamp)),
      [globalRewardEpoch, positions]
    )
    const shortCollateralYields = useMemo(() => {
      const rewardTokens = Object.values(
        shortPositions.reduce((sum, position) => {
          globalRewardEpoch
            .shortCollateralYieldPerDay(
              fromBigNumber(position.size),
              fromBigNumber(position.delta),
              position.expiryTimestamp,
              position.market().baseToken.symbol
            )
            .forEach(rewardToken => {
              if (!sum[rewardToken.symbol]) {
                sum[rewardToken.symbol] = rewardToken
                return
              }
              sum[rewardToken.symbol].amount += rewardToken.amount
            })
          return sum
        }, {} as Record<string, RewardEpochTokenAmount>)
      )
      return rewardTokens.length ? rewardTokens : globalRewardEpoch.tradingRewards(0, 0)
    }, [shortPositions, globalRewardEpoch])
    const displayYieldToken = shortCollateralYields.reduce(
      (max, yieldToken) => (yieldToken.amount > max.amount ? yieldToken : max),
      shortCollateralYields[0]
    )
    return (
      <Text variant="bodyLarge">
        {formatNumber(displayYieldToken.amount, { maxDps: 2 })} {displayYieldToken.symbol}
      </Text>
    )
  },
  () => <TextShimmer width={40} />
)

const RewardsShortsCards = ({ globalRewardEpoch, accountRewardEpoch, ...styleProps }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { tradingRewards, maxRewardToken } = useMemo(() => {
    const emptyTradingRewards = globalRewardEpoch.tradingRewards(0, 0)
    const pendingTradingRewards = accountRewardEpoch?.shortCollateralRewards ?? emptyTradingRewards
    const claimableTradingRewards = accountRewardEpoch?.claimableRewards.tradingRewards ?? emptyTradingRewards
    const tradingRewards = getUniqueRewardTokenAmounts([...pendingTradingRewards, ...claimableTradingRewards])
    const maxRewardToken = tradingRewards.reduce(
      (maxRewardToken, r) => (maxRewardToken.amount > r.amount ? maxRewardToken : r),
      tradingRewards[0]
    )

    return {
      tradingRewards,
      maxRewardToken,
    }
  }, [globalRewardEpoch, accountRewardEpoch])
  return (
    <Card
      onClick={() => navigate(getPagePath({ page: PageId.RewardsShorts, network: globalRewardEpoch.lyra.network }))}
      {...styleProps}
    >
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: REWARDS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            gridRowGap: 6,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <NetworkImage network={globalRewardEpoch?.lyra.network ?? Network.Optimism} />
            <Text ml={2} variant="bodyLarge">
              Shorts · {globalRewardEpoch ? getNetworkDisplayName(globalRewardEpoch.lyra.network) : null}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text color="secondaryText" mr={2} variant="bodyLarge">
                  Collateral
                </Text>
                <ShortCollateralValueText globalRewardEpoch={globalRewardEpoch} />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Yield / Day
                </Text>
                <ShortCollateralYieldText globalRewardEpoch={globalRewardEpoch} />
              </Flex>
              <Flex alignItems="center" ml="auto">
                <Text color="secondaryText" mr={2} variant="bodyLarge">
                  Rewards
                </Text>
                <RewardTokenAmounts
                  color={tradingRewards.some(t => t.amount > 0) ? 'primaryText' : 'text'}
                  variant="bodyLarge"
                  tokenAmounts={[maxRewardToken]}
                  hideTokenImages
                />
              </Flex>
            </>
          ) : null}

          <Flex ml="auto">
            <IconButton
              href={getPagePath({ page: PageId.RewardsShorts, network: globalRewardEpoch.lyra.network })}
              icon={IconType.ArrowRight}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default RewardsShortsCards
