import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { AccountRewardEpoch, Network } from '@lyrafinance/lyra-js'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import useNetwork from '@/app/hooks/account/useNetwork'
import { findLyraRewardEpochToken, findOpRewardEpochToken } from '@/app/utils/findRewardToken'

type Props = {
  accountRewardEpoch: AccountRewardEpoch
} & MarginProps &
  PaddingProps

const StakingRewardsHistoryGrid = ({ accountRewardEpoch, ...marginProps }: Props) => {
  const network = useNetwork()
  const lyraRewards = findLyraRewardEpochToken(accountRewardEpoch.stakingRewards)
  const opRewards = findOpRewardEpochToken(accountRewardEpoch.stakingRewards)
  const lyraUnlockTimestamp = findLyraRewardEpochToken(accountRewardEpoch?.stakingRewardsUnlockTimestamp ?? [])
  const showStakingRewards = lyraRewards > 0 || opRewards > 0
  const stakingApy = accountRewardEpoch.globalEpoch.stakingApy.reduce((total, apy) => total + apy.amount, 0)
  if (!showStakingRewards) {
    return null
  }
  return (
    <Box {...marginProps}>
      <Text variant="heading2" mb={4}>
        Staking Rewards
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 4, gridRowGap: 6 }}>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            LYRA Rewards (Locked)
          </Text>
          <TokenAmountText variant="secondary" tokenNameOrAddress="stkLyra" amount={lyraRewards} />
        </Flex>
        {network === Network.Optimism ? (
          <Flex flexDirection="column">
            <Text variant="secondary" color="secondaryText" mb={2}>
              OP Rewards
            </Text>
            <TokenAmountText variant="secondary" tokenNameOrAddress="op" amount={opRewards} />
          </Flex>
        ) : null}
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            LYRA Unlock
          </Text>
          <Text variant="secondary">{formatDate(lyraUnlockTimestamp)}</Text>
        </Flex>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            Avg. APY
          </Text>
          <Text variant="secondary">{formatPercentage(stakingApy, true)}</Text>
        </Flex>
      </Grid>
    </Box>
  )
}

export default StakingRewardsHistoryGrid
