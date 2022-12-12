import React from 'react'

import RewardsHistoryCard from '@/app/containers/rewards/RewardsHistoryCard'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

const RewardsHistoryPageHelper = () => {
  return (
    <Layout header="History" showBackButton>
      <LayoutGrid>
        <RewardsHistoryCard />
      </LayoutGrid>
    </Layout>
  )
}

export default RewardsHistoryPageHelper
