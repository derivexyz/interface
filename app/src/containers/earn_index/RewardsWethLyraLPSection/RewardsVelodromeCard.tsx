import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React from 'react'
import { useMemo } from 'react'

import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ZERO_BN } from '@/app/constants/bn'
import { EARN_REFERRALS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { VELODROME_ADD_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVelodromeStaking from '@/app/hooks/rewards/useVelodromeStaking'

const RewardsVelodromeStakingTVLText = withSuspense(
  () => {
    const velodromeStaking = useVelodromeStaking()
    return <Text>{formatTruncatedUSD(velodromeStaking?.tvl ?? ZERO_BN)}</Text>
  },
  () => <TextShimmer width={40} />
)

const RewardsVelodromeStakingLiquidityText = withSuspense(
  () => {
    const velodromeStaking = useVelodromeStaking()
    const balance = useMemo(
      () => (velodromeStaking ? velodromeStaking.lpTokenBalance * velodromeStaking.valuePerLPToken : 0),
      [velodromeStaking]
    )
    return (
      <Text color={velodromeStaking && velodromeStaking.lpTokenBalance > 0 ? 'primaryText' : 'text'}>
        {formatTruncatedUSD(balance)}
      </Text>
    )
  },
  () => <TextShimmer width={80} />
)

const RewardsVelodromeStakingAPYText = withSuspense(
  () => {
    const velodromeStaking = useVelodromeStaking()
    return <Text>{formatPercentage(velodromeStaking?.apy ?? 0, true)}</Text>
  },
  () => <TextShimmer width={40} />
)

export default function RewardsVelodromeCard() {
  const isMobile = useIsMobile()

  return (
    <Card href={VELODROME_ADD_LIQUIDITY_URL} target="_blank">
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: EARN_REFERRALS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['usdc', 'lyra']} size={32} network={AppNetwork.Optimism} />
            <Text ml={2}>Velodrome · Optimism</Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText">
                  TVL
                </Text>
                <RewardsVelodromeStakingTVLText />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  Your Liquidity
                </Text>
                <RewardsVelodromeStakingLiquidityText />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  APY
                </Text>
                <RewardsVelodromeStakingAPYText />
              </Flex>
            </>
          ) : null}
          <Flex ml="auto">
            <IconButton icon={IconType.ArrowUpRight} />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}
