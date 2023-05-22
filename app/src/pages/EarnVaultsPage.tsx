import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '../hooks/data/withSuspense'
import useEarnPageData from '../hooks/rewards/useEarnPageData'
import useFindVault from '../hooks/vaults/useFindVault'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import EarnVaultsPageHelper from '../page_helpers/EarnVaultsPageHelper'
import coerce from '../utils/coerce'

// /rewards
const EarnVaultsPage = withSuspense(
  (): JSX.Element => {
    const { network: networkStr, marketAddressOrName = null } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const data = useEarnPageData()
    const epochData = network && data ? data.epochs[network] : null
    const vault = useFindVault(data?.vaults ?? null, network, marketAddressOrName)

    if (!epochData) {
      return <PageError error="Error finding page data" />
    } else if (!vault || !network || !data?.vaults) {
      return <PageError error="Vault does not exist" />
    }

    return (
      <EarnVaultsPageHelper
        vaults={data.vaults}
        vault={vault}
        latestGlobalRewardEpoch={epochData.latestRewardEpoch.global}
        accountRewardEpochs={epochData.accountRewardEpochs}
      />
    )
  },
  () => <PageLoading />
)

export default EarnVaultsPage
