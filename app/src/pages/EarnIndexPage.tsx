import React from 'react'

import EarnIndexPageHelper from '@/app/page_helpers/EarnIndexPageHelper'

import withSuspense from '../hooks/data/withSuspense'
import useEarnPageData from '../hooks/rewards/useEarnPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import filterNulls from '../utils/filterNulls'

// /rewards
const EarnIndexPage = withSuspense(
  (): JSX.Element => {
    const data = useEarnPageData()
    if (!data) {
      return <PageError error="Failed to load page" />
    }
    const latestRewardEpochs = filterNulls(Object.values(data.epochs).map(epoch => epoch.latestRewardEpoch))
    const { vaults, lyraBalances, lyraStaking } = data
    return (
      <EarnIndexPageHelper
        latestRewardEpochs={latestRewardEpochs}
        vaults={vaults}
        lyraBalances={lyraBalances}
        lyraStaking={lyraStaking}
      />
    )
  },
  () => <PageLoading />
)

export default EarnIndexPage
