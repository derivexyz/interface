import React from 'react'

import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import VaultsIndexChartCard from '@/app/containers/vaults_index/VaultsIndexChartCard'
import VaultsIndexTableCard from '@/app/containers/vaults_index/VaultsIndexTableCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const VaultsIndexPageHelper = () => {
  return (
    <Page header="Vaults">
      <PageGrid>
        <VaultsIndexChartCard />
        <VaultsIndexTableCard />
        <VaultInfoCardRow />
      </PageGrid>
    </Page>
  )
}

export default VaultsIndexPageHelper
