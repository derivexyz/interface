import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import AdminMarketPageHelper from '@/app/page_helpers/AdminMarketPageHelper'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'

// /admin/:marketAddressOrName
const AdminMarketPage = withSuspense(
  () => {
    const { marketAddressOrName = null } = useParams()
    const market = useMarket(marketAddressOrName)
    return !market ? <LayoutPageError error="Market does not exist" /> : <AdminMarketPageHelper market={market} />
  },
  () => <LayoutPageLoading />
)

export default AdminMarketPage
