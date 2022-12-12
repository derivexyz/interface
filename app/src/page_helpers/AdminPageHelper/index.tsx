import React from 'react'

import AdminAddMarket from '@/app/containers/admin/AdminAddMarket'
import AdminGlobalInfo from '@/app/containers/admin/AdminGlobalInfo'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminMarketsInfo from '@/app/containers/admin/AdminMarketsInfo'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'
import withSuspense from '@/app/hooks/data/withSuspense'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'
import LayoutPageLoading from '../common/Layout/LayoutPageLoading'

const AdminPageHelper = withSuspense(
  () => {
    return (
      <Layout>
        <LayoutGrid>
          <AdminMarketSelect marketAddressOrName={null} />
          <AdminGlobalInfo />
          <AdminMarketsInfo />
          <AdminTransactionCard mt={4} mx={8} isCollapsible />
          <AdminAddMarket />
        </LayoutGrid>
      </Layout>
    )
  },
  () => <LayoutPageLoading />
)

export default AdminPageHelper
