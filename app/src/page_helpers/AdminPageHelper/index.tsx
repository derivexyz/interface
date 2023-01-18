import React from 'react'

import AdminAddMarket from '@/app/containers/admin/AdminAddMarket'
import AdminGlobalInfo from '@/app/containers/admin/AdminGlobalInfo'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminMarketsInfo from '@/app/containers/admin/AdminMarketsInfo'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'
import withSuspense from '@/app/hooks/data/withSuspense'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'
import PageLoading from '../common/Page/PageLoading'

const AdminPageHelper = withSuspense(
  () => {
    return (
      <Page>
        <PageGrid>
          <AdminMarketSelect marketAddressOrName={null} />
          <AdminGlobalInfo />
          <AdminMarketsInfo />
          <AdminTransactionCard mt={4} mx={8} isCollapsible />
          <AdminAddMarket />
        </PageGrid>
      </Page>
    )
  },
  () => <PageLoading />
)

export default AdminPageHelper
