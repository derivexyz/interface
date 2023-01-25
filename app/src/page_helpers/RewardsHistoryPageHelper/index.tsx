import React from 'react'

import { PageId } from '@/app/constants/pages'
import RewardsHistoryCard from '@/app/containers/rewards/RewardsHistoryCard'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const RewardsHistoryPageHelper = () => {
  return (
    <Page header="History" showBackButton backHref={getPagePath({ page: PageId.Rewards })}>
      <PageGrid>
        <RewardsHistoryCard />
      </PageGrid>
    </Page>
  )
}

export default RewardsHistoryPageHelper
