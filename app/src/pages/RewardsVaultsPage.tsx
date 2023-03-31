import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '../hooks/data/withSuspense'
import useRewardsPageData from '../hooks/rewards/useRewardsPageData'
import useFindVault from '../hooks/vaults/useFindVault'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import RewardsVaultsPageHelper from '../page_helpers/RewardsVaultsPageHelper'
import coerce from '../utils/coerce'

// /rewards
const RewardsVaultsPage = withSuspense(
  (): JSX.Element => {
    const { network: networkStr, marketAddressOrName = null } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const data = useRewardsPageData()
    const epochData = network && data ? data.epochs[network] : null
    const vault = useFindVault(data?.vaults ?? null, network, marketAddressOrName)

    if (!epochData) {
      return <PageError error="Error finding page data" />
    } else if (!vault || !network) {
      return <PageError error="Vault does not exist" />
    }

    return (
      <RewardsVaultsPageHelper
        vault={vault}
        latestGlobalRewardEpoch={epochData.latestRewardEpoch.global}
        accountRewardEpochs={epochData.accountRewardEpochs}
      />
    )
  },
  () => <PageLoading />
)

export default RewardsVaultsPage
