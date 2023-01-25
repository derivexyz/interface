import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import useAdminPageData from '@/app/hooks/admin/useAdminPageData'
import withSuspense from '@/app/hooks/data/withSuspense'
import AdminPageHelper from '@/app/page_helpers/AdminPageHelper'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useFindMarket from '../hooks/market/useFindMarket'
import coerce from '../utils/coerce'

// /admin/:network/:marketAddressOrName
const AdminPage = withSuspense(
  () => {
    const { marketAddressOrName = null, network: networkStr } = useParams()
    const { marketsWithGlobalCaches } = useAdminPageData()
    const network = coerce(Network, networkStr) ?? null
    const markets = marketsWithGlobalCaches.map(({ market }) => market)
    const selectedMarket = useFindMarket(markets, network, marketAddressOrName)
    const selectedGlobalCache = useMemo(
      () => marketsWithGlobalCaches.find(({ market }) => market.address === selectedMarket?.address)?.globalCache,
      [marketsWithGlobalCaches, selectedMarket]
    )
    return !selectedMarket || !selectedGlobalCache ? (
      <PageError error="Market does not exist" />
    ) : (
      <AdminPageHelper markets={markets} selectedMarket={selectedMarket} selectedGlobalCache={selectedGlobalCache} />
    )
  },
  () => <PageLoading />
)

export default AdminPage
