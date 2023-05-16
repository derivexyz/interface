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
import { useNavigate } from 'react-router-dom'

import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ZERO_BN } from '@/app/constants/bn'
import { EARN_REFERRALS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { AppNetwork } from '@/app/constants/networks'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useArrakisStaking from '@/app/hooks/rewards/useArrakisStaking'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getPagePath from '@/app/utils/getPagePath'

const RewardsArrakisStakingTVLText = withSuspense(
  () => {
    const arrakisStaking = useArrakisStaking()
    return <Text>{formatTruncatedUSD(arrakisStaking?.stakedTVL ?? ZERO_BN)}</Text>
  },
  () => <TextShimmer width={40} />
)

const RewardsArrakisStakingLiquidityText = withSuspense(
  () => {
    const arrakisStaking = useArrakisStaking()
    const liquidityValue = arrakisStaking
      ? fromBigNumber(arrakisStaking?.stakedLPTokenBalance) * arrakisStaking.lpTokenValue
      : 0
    return <Text>{formatTruncatedUSD(liquidityValue)}</Text>
  },
  () => <TextShimmer width={80} />
)

const RewardsArrakisStakingAPYText = withSuspense(
  () => {
    const arrakisStaking = useArrakisStaking()
    return (
      <Text color={arrakisStaking && arrakisStaking.stakedLPTokenBalance.gt(0) ? 'primaryText' : 'text'}>
        {formatPercentage(arrakisStaking?.apy ?? 0, true)}
      </Text>
    )
  },
  () => <TextShimmer width={40} />
)

export default function RewardsArrakisCard() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <Card onClick={() => navigate(getPagePath({ page: PageId.EarnArrakis }))}>
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: EARN_REFERRALS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['eth', 'lyra']} size={32} network={AppNetwork.Ethereum} />
            <Text ml={2}>Arrakis · Ethereum</Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText">
                  TVL
                </Text>
                <RewardsArrakisStakingTVLText />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  Your Liquidity
                </Text>
                <RewardsArrakisStakingLiquidityText />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  APY
                </Text>
                <RewardsArrakisStakingAPYText />
              </Flex>
            </>
          ) : null}
          <Flex ml="auto">
            <IconButton href={getPagePath({ page: PageId.EarnArrakis })} icon={IconType.ArrowRight} />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}
