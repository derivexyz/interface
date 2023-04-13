import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useLeaderboardPageData from '../hooks/leaderboard/useLeaderboardPageData'
import PageError from '../page_helpers/common/Page/PageError'
import LeaderboardPageHelper from '../page_helpers/LeaderboardPageHelper'

const LeaderboardPage = withSuspense(
  () => {
    const data = useLeaderboardPageData()
    if (!data) {
      return <PageError error="No leaderboard data" />
    }
    return <LeaderboardPageHelper data={data} />
  },
  () => <PageLoading />
)

export default LeaderboardPage
