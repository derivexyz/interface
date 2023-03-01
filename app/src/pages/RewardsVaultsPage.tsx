import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '../hooks/data/withSuspense'
import useFindMarket from '../hooks/market/useFindMarket'
import useRewardsPageData from '../hooks/rewards/useRewardsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import RewardsVaultsPageHelper from '../page_helpers/RewardsVaultsPageHelper'
import coerce from '../utils/coerce'

// /rewards
const RewardsVaultsPage = withSuspense(
  (): JSX.Element => {
    const { network: networkStr, marketAddressOrName = null } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const { epochs } = useRewardsPageData()

    const epochData = network ? epochs[network] : null

    const market = useFindMarket(epochData?.latestRewardEpoch?.global.markets ?? [], network, marketAddressOrName)
    if (!epochData) {
      return <PageError error="Error finding page data" />
    } else if (!market || !network) {
      return <PageError error="Market does not exist" />
    }

    return (
      <RewardsVaultsPageHelper
        market={market}
        latestRewardEpoch={epochData.latestRewardEpoch}
        accountRewardEpochs={epochData.accountRewardEpochs}
        globalRewardEpochs={epochData.globalRewardEpochs}
      />
    )
  },
  () => <PageLoading />
)

export default RewardsVaultsPage
