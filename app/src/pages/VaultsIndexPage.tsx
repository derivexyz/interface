import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useVaultsPageData from '../hooks/vaults/useVaultsPageData'
import VaultsIndexPageHelper from '../page_helpers/VaultsIndexPageHelper'

// /position/:network/:marketAddressOrName/:positionId
const PositionPage = withSuspense(
  () => {
    const vaults = useVaultsPageData()
    return <VaultsIndexPageHelper vaults={vaults} />
  },
  () => <PageLoading />
)

export default PositionPage
