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
import { WethLyraStaking } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ZERO_BN } from '@/app/constants/bn'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStaking from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useWethLyraStaking from '@/app/hooks/rewards/useWethLyraStaking'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  wethLyraStaking: WethLyraStaking | null
}

const WethLyraYourLiquidityText = withSuspense(
  () => {
    const accountWethLyraStaking = useAccountWethLyraStaking()
    const wethLyraStaking = useWethLyraStaking()
    const liquidityValue =
      fromBigNumber(accountWethLyraStaking?.stakedLPTokenBalance ?? ZERO_BN) * (wethLyraStaking?.lpTokenValue ?? 0)
    return <Text variant="bodyLarge">{formatTruncatedUSD(liquidityValue)}</Text>
  },
  () => <TextShimmer variant="bodyLarge" width={50} />
)

export default function RewardsWethLyraLPCard({ wethLyraStaking }: Props) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  return (
    <Card onClick={() => navigate(getPagePath({ page: PageId.RewardsEthLyraLp }))}>
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: `${isMobile ? '1fr 36px' : '1.8fr 1fr 1fr 0.7fr 36px'}`,
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['eth', 'lyra']} size={32} network="ethereum" />
            <Text ml={2} variant="bodyLarge">
              ETH-LYRA LP · Ethereum
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex alignItems="center">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  TVL
                </Text>
                <Text variant="bodyLarge">{formatTruncatedUSD(wethLyraStaking?.stakedTVL ?? ZERO_BN)}</Text>
              </Flex>
              <Flex alignItems="center">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Your Liquidity
                </Text>
                <WethLyraYourLiquidityText />
              </Flex>
              <Flex alignItems="center" ml="auto">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  APY
                </Text>
                <Text variant="bodyLarge">{formatPercentage(wethLyraStaking?.apy ?? 0, true)}</Text>
              </Flex>
            </>
          ) : null}
          <Flex ml="auto">
            <IconButton href={getPagePath({ page: PageId.RewardsEthLyraLp })} icon={IconType.ArrowRight} />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}
