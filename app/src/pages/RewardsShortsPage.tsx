import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsShortsPageData from '../hooks/rewards/useRewardsShortsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import RewardsShortsPageHelper from '../page_helpers/RewardsShortsPageHelper'
import coerce from '../utils/coerce'

// /rewards
const RewardsShortsPage = withSuspense(
  (): JSX.Element => {
    const { network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null

    const { epochs, collateral } = useRewardsShortsPageData(network)
    if (!network) {
      return <PageError errorCode="404" error="Page does not exist" />
    }
    const epochData = epochs[network]
    if (!epochData) {
      return <PageError errorCode="500" error="Error finding page data" />
    }

    return (
      <RewardsShortsPageHelper
        collateral={collateral}
        latestRewardEpoch={epochData.latestRewardEpoch}
        accountRewardEpochs={epochData.accountRewardEpochs}
        globalRewardEpochs={epochData.globalRewardEpochs}
      />
    )
  },
  () => <PageLoading />
)

export default RewardsShortsPage
