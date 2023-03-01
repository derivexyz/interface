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
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { GlobalRewardEpoch, Network, RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import NetworkImage from '@/app/components/common/NetworkImage'
import { ZERO_BN } from '@/app/constants/bn'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import useNetworkTradingVolume from '@/app/hooks/rewards/useNetworkTradingVolume'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
} & MarginProps

const ShortCollateralValueText = withSuspense(
  ({ globalRewardEpoch }: { globalRewardEpoch: GlobalRewardEpoch }) => {
    const positions = usePositionHistory(true)
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
    return (
      <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatUSD(shortCollateralValue, { maxDps: 2 })}
      </Text>
    )
  },
  () => <TextShimmer variant="bodyLarge" width={40} />
)

const NetworkTVLText = withSuspense(
  ({ network }: { network: Network }) => {
    const { totalShortOpenInterestUSD } = useNetworkTradingVolume(network)
    return (
      <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatTruncatedUSD(totalShortOpenInterestUSD)}
      </Text>
    )
  },
  () => <TextShimmer variant="bodyLarge" width={40} />
)

const ShortCollateralYieldText = withSuspense(({ globalRewardEpoch }: { globalRewardEpoch: GlobalRewardEpoch }) => {
  const positions = usePositionHistory(true)
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
    <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
      {formatNumber(displayYieldToken.amount, { maxDps: 2 })} {displayYieldToken.symbol}
    </Text>
  )
})

const ShortRewardsCards = ({ globalRewardEpoch, ...styleProps }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
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
            <Text ml={2} variant="bodyLarge" sx={{ fontWeight: 400 }}>
              Shorts · {globalRewardEpoch ? getNetworkDisplayName(globalRewardEpoch.lyra.network) : null}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  TVL
                </Text>
                <NetworkTVLText network={globalRewardEpoch.lyra.network} />
              </Flex>
              <Flex>
                <Text color="secondaryText" mr={2} variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  Your Collateral
                </Text>
                <ShortCollateralValueText globalRewardEpoch={globalRewardEpoch} />
              </Flex>
              <Flex ml="auto">
                <Text mr={2} color="secondaryText" variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  Yield / Day
                </Text>
                <ShortCollateralYieldText globalRewardEpoch={globalRewardEpoch} />
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

export default ShortRewardsCards
