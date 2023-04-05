import React from 'react'

import RewardsIndexPageHelper from '@/app/page_helpers/RewardsIndexPageHelper'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsPageData from '../hooks/rewards/useRewardsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import filterNulls from '../utils/filterNulls'

// /rewards
const RewardsIndexPage = withSuspense(
  (): JSX.Element => {
    const data = useRewardsPageData()
    if (!data) {
      return <PageError error="Failed to load page" />
    }
    const latestRewardEpochs = filterNulls(Object.values(data.epochs).map(epoch => epoch.latestRewardEpoch))
    const { vaults, lyraBalances, lyraStaking, lyraStakingAccount } = data
    return (
      <RewardsIndexPageHelper
        latestRewardEpochs={latestRewardEpochs}
        vaults={vaults}
        lyraBalances={lyraBalances}
        lyraStaking={lyraStaking}
        lyraStakingAccount={lyraStakingAccount}
      />
    )
  },
  () => <PageLoading />
)

export default RewardsIndexPage
