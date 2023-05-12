import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Network, RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import { NewTradingRewardsReferredTraders } from '@lyrafinance/lyra-js/src/utils/fetchAccountRewardEpochData'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import NetworkImage from '@/app/components/common/NetworkImage'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import getTokenInfo from '@/app/utils/getTokenInfo'

type Props = {
  referredTraders: NewTradingRewardsReferredTraders
}

const RewardsReferralsCard = ({ referredTraders }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const lyraToken = getTokenInfo('lyra', Network.Arbitrum)
  const { numTraders, volume, token } = useMemo(() => {
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
  }, [lyraToken?.address, lyraToken?.decimals, lyraToken?.symbol, referredTraders])
  return (
    <Card
      href={getPagePath({
        page: PageId.RewardsReferrals,
        network: Network.Arbitrum,
      })}
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
            <NetworkImage network={Network.Arbitrum} />
            <Text ml={2}>Referrals · {getNetworkDisplayName(Network.Arbitrum)}</Text>
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
              <Flex ml="auto">
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
                page: PageId.RewardsReferrals,
                network: Network.Arbitrum,
              })}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default RewardsReferralsCard
