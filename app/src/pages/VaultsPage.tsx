import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import VaultsPageHelper from '@/app/page_helpers/VaultsPageHelper'

import useMarket from '../hooks/market/useMarket'

// /vaults/:marketAddressOrName
const VaultsPage = withSuspense(
  () => {
    const { marketAddressOrName = null } = useParams()
    const market = useMarket(marketAddressOrName)
    return !market ? <LayoutPageError error="Vault does not exist" /> : <VaultsPageHelper market={market} />
  },
  () => <LayoutPageLoading />
)

export default VaultsPage
