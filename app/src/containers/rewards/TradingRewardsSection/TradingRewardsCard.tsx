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
import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import NetworkImage from '@/app/components/common/NetworkImage'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useNetworkTradingVolume from '@/app/hooks/rewards/useNetworkTradingVolume'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  accountRewardEpoch?: AccountRewardEpoch | null
} & MarginProps

const TradingVolumeText = withSuspense(
  ({ network }: { network: Network }) => {
    const { totalNotionalVolume } = useNetworkTradingVolume(network)
    return (
      <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatTruncatedUSD(totalNotionalVolume)}
      </Text>
    )
  },
  () => <TextShimmer variant="bodyLarge" width={48} />
)

const TradingRewardsCard = ({ globalRewardEpoch, accountRewardEpoch, ...styleProps }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const tradingFees = accountRewardEpoch?.tradingFees ?? 0
  const tradingRewards = accountRewardEpoch?.tradingRewards ?? globalRewardEpoch.tradingRewards(0, 0)
  const displayRewardToken = tradingRewards.reduce(
    (max, yieldToken) => (yieldToken.amount > max.amount ? yieldToken : max),
    tradingRewards[0]
  )
  return (
    <Card
      onClick={() => navigate(getPagePath({ page: PageId.RewardsTrading, network: globalRewardEpoch.lyra.network }))}
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
              Trading · {globalRewardEpoch ? getNetworkDisplayName(globalRewardEpoch?.lyra.network) : ''}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex alignItems="center">
                <Text color="secondaryText" mr={2} variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  Volume
                </Text>
                <TradingVolumeText network={globalRewardEpoch.lyra.network} />
              </Flex>
              <Flex alignItems="center">
                <Text color="secondaryText" mr={2} variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  Your Fees
                </Text>
                <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  {formatUSD(tradingFees, { maxDps: 2 })}
                </Text>
              </Flex>
              <Flex alignItems="center" ml="auto">
                <Text color="secondaryText" mr={2} variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  Your Rebate
                </Text>
                <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  {formatNumber(displayRewardToken.amount, { maxDps: 2 })} {displayRewardToken.symbol}
                </Text>
              </Flex>
            </>
          ) : null}
          <Flex ml="auto">
            <IconButton
              href={getPagePath({ page: PageId.RewardsTrading, network: globalRewardEpoch.lyra.network })}
              icon={IconType.ArrowRight}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default TradingRewardsCard
