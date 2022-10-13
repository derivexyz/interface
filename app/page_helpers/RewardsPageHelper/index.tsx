import React from 'react'

import RewardsLastUpdatedAlert from '@/app/containers/common/RewardsLastUpdatedAlert'
import RewardsBreakdownCard from '@/app/containers/rewards/RewardsBreakdownCard'
import RewardsStakingCard from '@/app/containers/rewards/RewardsStakingCard'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

const RewardsPageHelper = () => {
  return (
    <Layout header="Rewards">
      <LayoutGrid>
        <RewardsLastUpdatedAlert />
        <RewardsStakingCard />
        <RewardsBreakdownCard />
      </LayoutGrid>
    </Layout>
  )
}

export default RewardsPageHelper
