import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'

type Props = {
  accountRewardEpoch: AccountRewardEpoch
} & MarginProps &
  PaddingProps

const StakingRewardsHistoryGrid = ({ accountRewardEpoch, ...marginProps }: Props) => {
  const lyraRewards = accountRewardEpoch.stakingRewards.lyra
  const opRewards = accountRewardEpoch.stakingRewards.op
  const stakingRewards = accountRewardEpoch.stakingRewards
  const lyraUnlockTimestamp = accountRewardEpoch.stakingRewardsUnlockTimestamp.lyra
  const showStakingRewards = stakingRewards.lyra > 0 || stakingRewards.op > 0
  const stakingApy = accountRewardEpoch.globalEpoch.stakingApy.total
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
            stkLYRA Rewards (Locked)
          </Text>
          <TokenAmountText variant="secondary" tokenNameOrAddress="stkLyra" amount={lyraRewards} />
        </Flex>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            OP Rewards
          </Text>
          <TokenAmountText variant="secondary" tokenNameOrAddress="op" amount={opRewards} />
        </Flex>
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
