import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import AdminMarketPageHelper from '@/app/page_helpers/AdminMarketPageHelper'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import coerce from '../utils/coerce'

// /admin/:marketAddressOrName
const AdminMarketPage = withSuspense(
  () => {
    const { marketAddressOrName = null, network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const market = useMarket(network, marketAddressOrName)
    return !market ? <PageError error="Market does not exist" /> : <AdminMarketPageHelper market={market} />
  },
  () => <PageLoading />
)

export default AdminMarketPage
