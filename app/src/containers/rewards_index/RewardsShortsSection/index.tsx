import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'

import RewardsShortsCards from './RewardsShortsCard'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
} & MarginProps
const RewardsShortsSection = ({ latestRewardEpochs, ...marginProps }: Props): CardElement => {
  return (
    <Flex flexDirection="column" mt={[6, 0]}>
      <Box px={[6, 0]} mb={5}>
        <Text mb={2} variant="title">
          Short Collateral
        </Text>
        <Text color="secondaryText">Earn rewards by selling options.</Text>
      </Box>
      <Flex flexDirection="column" {...marginProps}>
        {latestRewardEpochs.map((latestRewardEpoch, i) => (
          <RewardsShortsCards
            mb={i < latestRewardEpochs.length ? 4 : 0}
            globalRewardEpoch={latestRewardEpoch.global}
            accountRewardEpoch={latestRewardEpoch.account}
            key={latestRewardEpoch.global.lyra.network}
          />
        ))}
      </Flex>
    </Flex>
  )
}

export default RewardsShortsSection
