import React from 'react'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsEthLyraLPPageData from '../hooks/rewards/useRewardsEthLyraLPPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import RewardsEthLyraLPPageHelper from '../page_helpers/RewardsEthLyraLPPageHelper'

// /rewards
const RewardsEthLyraLPPage = withSuspense(
  (): JSX.Element => {
    const { wethLyraStaking, accountWethLyraStaking, claimableBalance, accountWethLyraStakingL2 } =
      useRewardsEthLyraLPPageData()
    if (!wethLyraStaking) {
      return <PageError error="Page does not exist" />
    }
    return (
      <RewardsEthLyraLPPageHelper
        claimableBalance={claimableBalance}
        wethLyraStaking={wethLyraStaking}
        wethLyraStakingAccount={accountWethLyraStaking}
        wethLyraStakingAccountL2={accountWethLyraStakingL2}
      />
    )
  },
  () => <PageLoading />
)

export default RewardsEthLyraLPPage
