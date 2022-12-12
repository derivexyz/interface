import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React, { useMemo, useState } from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountRewardEpochs from '@/app/hooks/rewards/useAccountRewardEpochs'

import RewardsHistoryCardSection from './RewardsHistoryCardSection'

export const REWARDS_HISTORY_DEFAULT_EPOCH_LIMIT = 3

type Props = MarginProps

const RewardsHistoryCard = withSuspense(
  ({ ...marginProps }: Props) => {
    const [showAll, setShowAll] = useState<boolean>(false)
    const accountRewardEpochs = useAccountRewardEpochs()
    const epochs = useMemo(() => {
      const rewardEpochs = accountRewardEpochs
        .sort((a, b) => b.globalEpoch.endTimestamp - a.globalEpoch.endTimestamp)
        .slice(0, showAll ? undefined : REWARDS_HISTORY_DEFAULT_EPOCH_LIMIT)
      return rewardEpochs
    }, [accountRewardEpochs, showAll])

    return (
      <Card overflow="hidden" {...marginProps}>
        {epochs.length === 0 ? (
          <CardBody>
            <Text color="secondaryText">You have no rewards history</Text>
          </CardBody>
        ) : null}
        {epochs.map((accountRewardEpoch, idx) => {
          const epochNumber = accountRewardEpochs.length - idx
          return (
            <Box key={epochNumber}>
              {idx > 0 ? <CardSeparator /> : null}
              <RewardsHistoryCardSection epochNumber={epochNumber} accountRewardEpoch={accountRewardEpoch} />
            </Box>
          )
        })}
        {!showAll && epochs.length >= REWARDS_HISTORY_DEFAULT_EPOCH_LIMIT ? (
          <CardSection
            onClick={() => setShowAll(true)}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              ':hover': { bg: 'buttonHover' },
            }}
          >
            <Text variant="bodyMedium" color="secondaryText">
              Show More
            </Text>
          </CardSection>
        ) : null}
      </Card>
    )
  },
  (accountRewardEpochs, ...marginProps) => {
    return (
      <Card flexDirection="column" {...marginProps}>
        <CardBody>
          <Center>
            <Spinner />
          </Center>
        </CardBody>
      </Card>
    )
  }
)

export default RewardsHistoryCard
