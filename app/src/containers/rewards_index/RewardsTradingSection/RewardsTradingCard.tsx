import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountLyraBalances, AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import NetworkImage from '@/app/components/common/NetworkImage'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import getUniqueRewardTokenAmounts from '@/app/utils/getUniqueRewardTokenAmounts'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  accountRewardEpoch?: AccountRewardEpoch | null
  lyraBalances: AccountLyraBalances
} & MarginProps

const RewardsTradingCard = ({ globalRewardEpoch, accountRewardEpoch, lyraBalances, ...styleProps }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const tradingFees = accountRewardEpoch?.tradingFees ?? 0
  const { tradingRewards, effectiveRebate, maxRewardToken } = useMemo(() => {
    const emptyTradingRewards = globalRewardEpoch.tradingRewards(0, 0)
    const pendingTradingRewards = accountRewardEpoch?.tradingRewards ?? emptyTradingRewards
    const claimableTradingRewards = accountRewardEpoch?.claimableRewards.tradingRewards ?? emptyTradingRewards
    const tradingRewards = getUniqueRewardTokenAmounts([...pendingTradingRewards, ...claimableTradingRewards])
    const maxRewardToken = tradingRewards.reduce(
      (maxRewardToken, r) => (maxRewardToken.amount > r.amount ? maxRewardToken : r),
      tradingRewards[0]
    )

    const { ethereumStkLyra, arbitrumStkLyra, optimismStkLyra } = lyraBalances
    const stkLyraBalance = fromBigNumber(ethereumStkLyra.add(arbitrumStkLyra).add(optimismStkLyra))
    return {
      tradingRewards,
      maxRewardToken,
      effectiveRebate: globalRewardEpoch.tradingFeeRebate(stkLyraBalance),
    }
  }, [globalRewardEpoch, accountRewardEpoch, lyraBalances])

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
            <Text ml={2} variant="bodyLarge">
              Trading · {globalRewardEpoch ? getNetworkDisplayName(globalRewardEpoch?.lyra.network) : ''}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex alignItems="center">
                <Text color="secondaryText" mr={2} variant="bodyLarge">
                  Fees
                </Text>
                <Text variant="bodyLarge">{formatUSD(tradingFees, { maxDps: 2 })}</Text>
              </Flex>
              <Flex alignItems="center">
                <Text mr={2} variant="bodyLarge" color="secondaryText">
                  Rebate
                </Text>
                <Text
                  color={
                    effectiveRebate > globalRewardEpoch.tradingFeeRebateTiers[0].feeRebate ? 'primaryText' : 'text'
                  }
                  variant="bodyLarge"
                >
                  {formatPercentage(effectiveRebate, true)}
                </Text>
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
              href={getPagePath({ page: PageId.RewardsTrading, network: globalRewardEpoch.lyra.network })}
              icon={IconType.ArrowRight}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default RewardsTradingCard
