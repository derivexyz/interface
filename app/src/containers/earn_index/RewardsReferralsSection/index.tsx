import { CardElement } from '@lyra/ui/components/Card'
import Grid from '@lyra/ui/components/Grid'
import { NewTradingRewardsReferredTraders } from '@lyrafinance/lyra-js/src/utils/fetchAccountRewardEpochData'
import React from 'react'

import RewardsReferralsCard from './RewardsReferralsCard'

type Props = {
  referredTraders: NewTradingRewardsReferredTraders
}

const RewardsReferralsSection = ({ referredTraders }: Props): CardElement => {
  return (
    <Grid sx={{ gridTemplateColumns: '1fr', gridRowGap: 4 }}>
      <RewardsReferralsCard referredTraders={referredTraders} />
    </Grid>
  )
}

export default RewardsReferralsSection
