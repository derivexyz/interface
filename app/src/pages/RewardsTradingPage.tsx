import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsPageData from '../hooks/rewards/useRewardsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import RewardsTradingPageHelper from '../page_helpers/RewardsTradingPageHelper'
import coerce from '../utils/coerce'

// /rewards
const RewardsTradingPage = withSuspense(
  (): JSX.Element => {
    const { network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null

    const data = useRewardsPageData()
    const epochData = network && data ? data.epochs[network] : null
    if (!epochData) {
      return <PageError errorCode="500" error="Error finding page data" />
    } else if (!network) {
      return <PageError error="Page does not exist" />
    }

    return (
      <RewardsTradingPageHelper
        latestRewardEpoch={epochData.latestRewardEpoch}
        accountRewardEpochs={epochData.accountRewardEpochs}
      />
    )
  },
  () => <PageLoading />
)

export default RewardsTradingPage
