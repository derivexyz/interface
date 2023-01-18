import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'
import VaultsPageHelper from '@/app/page_helpers/VaultsPageHelper'

import useMarket from '../hooks/market/useMarket'
import coerce from '../utils/coerce'

// /vaults/:marketAddressOrName
const VaultsPage = withSuspense(
  () => {
    const { marketAddressOrName = null, network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const market = useMarket(network, marketAddressOrName)
    return !market || !network ? <PageError error="Vault does not exist" /> : <VaultsPageHelper market={market} />
  },
  () => <PageLoading />
)

export default VaultsPage
