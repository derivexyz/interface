import React from 'react'

import RewardsLastUpdatedAlert from '@/app/containers/common/RewardsLastUpdatedAlert'
import RewardsBreakdownCard from '@/app/containers/rewards/RewardsBreakdownCard'
import RewardsStakingCard from '@/app/containers/rewards/RewardsStakingCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const RewardsPageHelper = () => {
  return (
    <Page header="Rewards">
      <PageGrid>
        <RewardsLastUpdatedAlert />
        <RewardsStakingCard />
        <RewardsBreakdownCard />
      </PageGrid>
    </Page>
  )
}

export default RewardsPageHelper
