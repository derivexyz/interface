import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useLeaderboardPageData from '../hooks/leaderboard/useLeaderboardPageData'
import PageError from '../page_helpers/common/Page/PageError'
import LeaderboardPageHelper from '../page_helpers/LeaderboardPageHelper'
import coerce from '../utils/coerce'

const LeaderboardPage = withSuspense(
  () => {
    const { network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null

    const data = useLeaderboardPageData(network)
    if (!data) {
      return <PageError error="No leaderboard data" />
    } else if (!network) {
      return <PageError error="Page not found" />
    }

    return <LeaderboardPageHelper data={data} network={network} />
  },
  () => <PageLoading />
)

export default LeaderboardPage
