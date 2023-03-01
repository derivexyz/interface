import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import { findLyraRewardEpochToken, findOpRewardEpochToken } from '@/app/utils/findRewardToken'

type Props = {
  accountRewardEpoch: AccountRewardEpoch
} & MarginProps &
  PaddingProps

const TradingRewardsHistoryGrid = ({ accountRewardEpoch, ...marginProps }: Props) => {
  const lyraRewards = findLyraRewardEpochToken(accountRewardEpoch.tradingRewards)
  const opRewards = findOpRewardEpochToken(accountRewardEpoch.tradingRewards)
  const { tradingFees, tradingFeeRebate } = accountRewardEpoch
  if (!opRewards || !lyraRewards) {
    return null
  }
  return (
    <Box {...marginProps}>
      <Text variant="heading2" mb={4}>
        Trading Rewards
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 4, gridRowGap: 6 }}>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            LYRA Rewards
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
            Total Fees
          </Text>
          <Text variant="secondary">{formatUSD(tradingFees)}</Text>
        </Flex>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            Fee Rebate
          </Text>
          <Text variant="secondary">{formatPercentage(tradingFeeRebate, true)}</Text>
        </Flex>
      </Grid>
    </Box>
  )
}

export default TradingRewardsHistoryGrid
