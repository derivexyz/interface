import React from 'react'

import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import RewardsLastUpdatedAlert from '@/app/containers/common/RewardsLastUpdatedAlert'
import VaultsIndexMarketsCard from '@/app/containers/vaults_index/VaultsIndexMarketsCard'
import VaultsIndexMyLiquidityCard from '@/app/containers/vaults_index/VaultsIndexMyLiquidityCard'
import VaultsIndexTVLChartCard from '@/app/containers/vaults_index/VaultsIndexTVLChartCard'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

const VaultsIndexPageHelper = () => {
  return (
    <Layout desktopHeader="Vaults" mobileHeader="Vaults" mobileCollapsedHeader="Vaults">
      <LayoutGrid>
        <RewardsLastUpdatedAlert />
        <VaultsIndexTVLChartCard />
        <VaultsIndexMyLiquidityCard />
        <VaultsIndexMarketsCard />
        <VaultInfoCardRow />
      </LayoutGrid>
    </Layout>
  )
}

export default VaultsIndexPageHelper
