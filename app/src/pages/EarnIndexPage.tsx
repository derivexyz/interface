import React from 'react'

import EarnIndexPageHelper from '@/app/page_helpers/EarnIndexPageHelper'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsPageData from '../hooks/rewards/useRewardsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import filterNulls from '../utils/filterNulls'

// /rewards
const EarnIndexPage = withSuspense(
  (): JSX.Element => {
    const data = useRewardsPageData()
    if (!data) {
      return <PageError error="Failed to load page" />
    }
    const latestRewardEpochs = filterNulls(Object.values(data.epochs).map(epoch => epoch.latestRewardEpoch))
    const { vaults, lyraBalances, lyraStaking, referredTraders } = data
    return (
      <EarnIndexPageHelper
        latestRewardEpochs={latestRewardEpochs}
        vaults={vaults}
        lyraBalances={lyraBalances}
        lyraStaking={lyraStaking}
        referredTraders={referredTraders}
      />
    )
  },
  () => <PageLoading />
)

export default EarnIndexPage
