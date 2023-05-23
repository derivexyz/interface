import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import NetworkImage from '@/app/components/common/NetworkImage'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { EARN_REFERRALS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useEarnPageData'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import getTokenInfo from '@/app/utils/getTokenInfo'

type Props = {
  rewardEpoch: LatestRewardEpoch
}

const RewardsReferralsCard = ({ rewardEpoch }: Props) => {
  const isMobile = useIsMobile()
  const network = rewardEpoch.global.lyra.network
  const lyraToken = getTokenInfo('lyra', network)
  const { numTraders, volume, token } = useMemo(() => {
    const referredTraders = rewardEpoch.account?.accountEpoch.tradingRewards.newRewards.referredTraders
    const numTraders = referredTraders ? Object.keys(referredTraders).length : 0
    const volume = referredTraders
      ? Object.values(referredTraders).reduce((total, trader) => total + trader.volume, 0)
      : 0
    const tokenAmount = referredTraders
      ? Object.values(referredTraders).reduce((total, trader) => total + (trader?.tokens[0]?.amount ?? 0), 0)
      : 0
    const token: RewardEpochTokenAmount[] = [
      {
        address: lyraToken?.address ?? '',
        symbol: lyraToken?.symbol ?? 'lyra',
        decimals: lyraToken?.decimals ?? 18,
        amount: tokenAmount,
      },
    ]
    return {
      numTraders,
      volume,
      token,
    }
  }, [
    lyraToken?.address,
    lyraToken?.decimals,
    lyraToken?.symbol,
    rewardEpoch.account?.accountEpoch.tradingRewards.newRewards.referredTraders,
  ])
  return (
    <Card
      href={getPagePath({
        page: PageId.EarnReferrals,
        network: network,
      })}
    >
      <CardBody>
        <Grid
          width="100%"
          sx={{
            gridTemplateColumns: EARN_REFERRALS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            gridRowGap: 6,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <NetworkImage network={network} />
            <Text ml={2}>Referrals · {getNetworkDisplayName(network)}</Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText">
                  Volume
                </Text>
                <Text>{formatUSD(volume)}</Text>
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  Traders
                </Text>
                <Text>{numTraders}</Text>
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText">
                  Rewards
                </Text>
                <RewardTokenAmounts color={'text'} tokenAmounts={token} hideTokenImages={true} />
              </Flex>
            </>
          ) : null}

          <Flex justifySelf="end">
            <IconButton
              icon={IconType.ArrowRight}
              href={getPagePath({
                page: PageId.EarnReferrals,
                network: network,
              })}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default RewardsReferralsCard
