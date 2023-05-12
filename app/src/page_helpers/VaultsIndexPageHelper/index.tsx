import React from 'react'

import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import { Vault } from '@/app/constants/vault'
import VaultsIndexChartCard from '@/app/containers/vaults_index/VaultsIndexChartCard'
import VaultsIndexTableCard from '@/app/containers/vaults_index/VaultsIndexTableCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  vaults: Vault[]
}

const VaultsIndexPageHelper = ({ vaults }: Props) => {
  return (
    <Page title="Vaults" subtitle="Deposit stables, earn trading fees">
      <PageGrid>
        <VaultsIndexChartCard />
        <VaultsIndexTableCard vaults={vaults} />
        <VaultInfoCardRow />
      </PageGrid>
    </Page>
  )
}

export default VaultsIndexPageHelper
