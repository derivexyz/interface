import React from 'react'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsArrakisPageData from '../hooks/rewards/useRewardsArrakisPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import EarnArrakisPageHelper from '../page_helpers/EarnArrakisPageHelper'

// /rewards
const EarnArrakisPage = withSuspense(
  (): JSX.Element => {
    const { arrakisStaking, arrakisOpStaking: ararkisOpStakingAccount } = useRewardsArrakisPageData()
    if (!arrakisStaking) {
      return <PageError error="Page does not exist" />
    }
    return <EarnArrakisPageHelper arrakisStaking={arrakisStaking} arrakisOpStakingAccount={ararkisOpStakingAccount} />
  },
  () => <PageLoading />
)

export default EarnArrakisPage
