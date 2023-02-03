import Box from '@lyra/ui/components/Box'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

import ShortCollateralRewardsHistoryGrid from './ShortCollateralRewardsHistoryGrid'
import StakingRewardsHistoryGrid from './StakingRewardsHistoryGrid'
import TradingRewardsHistoryGrid from './TradingRewardsHistoryGrid'
import VaultRewardsHistoryGrid from './VaultRewardsHistoryGrid'

type Props = {
  epochNumber: number
  accountRewardEpoch: AccountRewardEpoch
} & MarginProps

const RewardsHistoryCardSection = ({ accountRewardEpoch, epochNumber, ...marginProps }: Props) => {
  return (
    <CardSection {...marginProps}>
      <Box>
        <Text variant="heading">Epoch {epochNumber}</Text>
        <Text variant="small" color="secondaryText">
          {formatDate(accountRewardEpoch.globalEpoch.startTimestamp, true)} -{' '}
          {formatDate(accountRewardEpoch.globalEpoch.endTimestamp, true)}
        </Text>
      </Box>
      <StakingRewardsHistoryGrid accountRewardEpoch={accountRewardEpoch} mt={8} />
      <TradingRewardsHistoryGrid accountRewardEpoch={accountRewardEpoch} mt={8} />
      <ShortCollateralRewardsHistoryGrid accountRewardEpoch={accountRewardEpoch} mt={8} />
      <VaultRewardsHistoryGrid accountRewardEpoch={accountRewardEpoch} mt={8} />
    </CardSection>
  )
}

export default RewardsHistoryCardSection
