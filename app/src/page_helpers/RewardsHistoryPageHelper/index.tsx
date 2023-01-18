import React from 'react'

import RewardsHistoryCard from '@/app/containers/rewards/RewardsHistoryCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const RewardsHistoryPageHelper = () => {
  return (
    <Page header="History" showBackButton>
      <PageGrid>
        <RewardsHistoryCard />
      </PageGrid>
    </Page>
  )
}

export default RewardsHistoryPageHelper
