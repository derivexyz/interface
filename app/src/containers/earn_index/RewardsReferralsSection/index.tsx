import { CardElement } from '@lyra/ui/components/Card'
import Grid from '@lyra/ui/components/Grid'
import React from 'react'

import { LatestRewardEpoch } from '@/app/hooks/rewards/useEarnPageData'

import RewardsReferralsCard from './RewardsReferralsCard'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
}

const RewardsReferralsSection = ({ latestRewardEpochs }: Props): CardElement => {
  return (
    <Grid sx={{ gridTemplateColumns: '1fr', gridRowGap: 4 }}>
      {latestRewardEpochs.map((rewardEpoch, idx) => {
        return <RewardsReferralsCard key={idx} rewardEpoch={rewardEpoch} />
      })}
    </Grid>
  )
}

export default RewardsReferralsSection
