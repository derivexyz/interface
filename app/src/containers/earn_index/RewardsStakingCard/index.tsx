import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import { LatestRewardEpoch } from '@/app/hooks/rewards/useEarnPageData'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import RewardsNotStakedCardSection from './RewardsNotStakedCardSection'
import RewardsStakedCardSection from './RewardsStakedCardSection'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
}

const RewardsStakingCard = ({ latestRewardEpochs, lyraBalances, lyraStaking }: Props): CardElement => {
  const isMobile = useIsMobile()
  return (
    <Card flexDirection={isMobile ? 'column' : 'row'}>
      <RewardsStakedCardSection
        latestRewardEpochs={latestRewardEpochs}
        lyraStaking={lyraStaking}
        lyraBalances={lyraBalances}
      />
      {isMobile ? null : (
        <>
          <CardSeparator isVertical={!isMobile} />
          <RewardsNotStakedCardSection lyraBalances={lyraBalances} />
        </>
      )}
    </Card>
  )
}

export default RewardsStakingCard
