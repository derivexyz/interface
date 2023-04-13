import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useLeaderboardHistoryPageData from '../hooks/leaderboard/useLeaderboardHistoryPageData'
import PageError from '../page_helpers/common/Page/PageError'
import LeaderboardHistoryPageHelper from '../page_helpers/LeaderboardHistoryPageHelper'

const LeaderboardHistoryPage = withSuspense(
  () => {
    const data = useLeaderboardHistoryPageData()
    if (!data) {
      return <PageError error="No historical data available" />
    }
    return <LeaderboardHistoryPageHelper data={data} />
  },
  () => <PageLoading />
)

export default LeaderboardHistoryPage
