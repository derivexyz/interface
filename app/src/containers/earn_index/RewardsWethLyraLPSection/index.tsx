import { CardElement } from '@lyra/ui/components/Card'
import Grid from '@lyra/ui/components/Grid'
import React from 'react'

import RewardsArrakisCard from './RewardsArrakisCard'
import RewardsCamelotCard from './RewardsCamelotCard'
import RewardsVelodromeCard from './RewardsVelodromeCard'

const RewardsWethLyraLPSection = (): CardElement => {
  return (
    <Grid sx={{ gridTemplateColumns: '1fr', gridRowGap: 4 }}>
      <RewardsArrakisCard />
      <RewardsCamelotCard />
      <RewardsVelodromeCard />
    </Grid>
  )
}

export default RewardsWethLyraLPSection
