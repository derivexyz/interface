import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import useNetwork from '@/app/hooks/account/useNetwork'
import { findLyraRewardEpochToken, findOpRewardEpochToken } from '@/app/utils/findRewardToken'

type Props = {
  accountRewardEpoch: AccountRewardEpoch
} & MarginProps &
  PaddingProps

const ShortCollateralRewardsHistoryGrid = ({ accountRewardEpoch, ...marginProps }: Props) => {
  const network = useNetwork()
  const lyraRewards = findLyraRewardEpochToken(accountRewardEpoch.shortCollateralRewards ?? [])
  const opRewards = findOpRewardEpochToken(accountRewardEpoch.shortCollateralRewards ?? [])
  return (
    <Box {...marginProps}>
      <Text variant="heading2" mb={4}>
        Short Collateral Rewards
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 4, gridRowGap: 6 }}>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            LYRA Rewards
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
      </Grid>
    </Box>
  )
}

export default ShortCollateralRewardsHistoryGrid
