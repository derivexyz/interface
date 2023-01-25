import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'
import VaultsPageHelper from '@/app/page_helpers/VaultsPageHelper'

import useFindVault from '../hooks/vaults/useFindVault'
import useVaultsPageData from '../hooks/vaults/useVaultsPageData'
import coerce from '../utils/coerce'

// /vaults/:network/:marketAddressOrName
const VaultsPage = withSuspense(
  () => {
    const { marketAddressOrName = null, network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null

    const vaults = useVaultsPageData()
    const selectedVault = useFindVault(vaults, network, marketAddressOrName)

    return !selectedVault ? (
      <PageError error="Vault does not exist" />
    ) : (
      <VaultsPageHelper vaults={vaults} selectedVault={selectedVault} />
    )
  },
  () => <PageLoading />
)

export default VaultsPage
