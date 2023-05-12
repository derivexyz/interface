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
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { CAMELOT_ADD_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import withSuspense from '@/app/hooks/data/withSuspense'
import useCamelotStaking from '@/app/hooks/rewards/useCamelotStaking'

const RewardsCamelotStakingTVLText = withSuspense(
  () => {
    const camelotStaking = useCamelotStaking()
    return <Text>{formatTruncatedUSD(camelotStaking?.tvl ?? ZERO_BN)}</Text>
  },
  () => <TextShimmer width={40} />
)

const RewardsCamelotStakingLiquidityText = withSuspense(
  () => {
    const camelotStaking = useCamelotStaking()
    const balance = useMemo(
      () => (camelotStaking ? camelotStaking.lpTokenBalance * camelotStaking.valuePerLPToken : 0),
      [camelotStaking]
    )
    return (
      <Text color={camelotStaking && camelotStaking.lpTokenBalance > 0 ? 'primaryText' : 'text'}>
        {formatTruncatedUSD(balance)}
      </Text>
    )
  },
  () => <TextShimmer width={80} />
)

const RewardsCamelotStakingAPYText = withSuspense(
  () => {
    const camelotStaking = useCamelotStaking()
    return <Text>{formatPercentage(camelotStaking?.apy ?? 0, true)}</Text>
  },
  () => <TextShimmer width={40} />
)

export default function RewardsCamelotCard() {
  const isMobile = useIsMobile()

  return (
    <Card href={CAMELOT_ADD_LIQUIDITY_URL} target="_blank">
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: REWARDS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['eth', 'lyra']} size={32} network={AppNetwork.Arbitrum} />
            <Text ml={2}>Camelot · Arbitrum</Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText">
                  TVL
                </Text>
                <RewardsCamelotStakingTVLText />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  Your Liquidity
                </Text>
                <RewardsCamelotStakingLiquidityText />
              </Flex>
              <Flex ml="auto">
                <Text mr={2} color="secondaryText">
                  APY
                </Text>
                <RewardsCamelotStakingAPYText />
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
