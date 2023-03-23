import React from 'react'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsArrakisPageData from '../hooks/rewards/useRewardsArrakisPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import RewardsArrakisPageHelper from '../page_helpers/RewardsArrakisPageHelper'

// /rewards
const RewardsArrakisPage = withSuspense(
  (): JSX.Element => {
    const { arrakisStaking, arrakisOpStaking: ararkisOpStakingAccount } = useRewardsArrakisPageData()
    if (!arrakisStaking) {
      return <PageError error="Page does not exist" />
    }
    return (
      <RewardsArrakisPageHelper arrakisStaking={arrakisStaking} arrakisOpStakingAccount={ararkisOpStakingAccount} />
    )
  },
  () => <PageLoading />
)

export default RewardsArrakisPage
