import Flex from '@lyra/ui/components/Flex'
import React from 'react'

import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import { PageId } from '@/app/constants/pages'
import { Vault } from '@/app/constants/vault'
import VaultsChartCard from '@/app/containers/vaults/VaultsChartCard'
import VaultsMarketDropdown from '@/app/containers/vaults/VaultsMarketDropdown'
import VaultsMyLiquidityCard from '@/app/containers/vaults/VaultsMyLiquidityCard'
import VaultsStatsCard from '@/app/containers/vaults/VaultsStatsCard'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  vaults: Vault[]
  selectedVault: Vault
}

const VaultsPageHelper = ({ selectedVault, vaults }: Props) => {
  const { market } = selectedVault
  return (
    <Page
      title="Vaults"
      subtitle="Deposit stables, earn trading fees"
      showBackButton
      backHref={getPagePath({ page: PageId.VaultsIndex })}
    >
      <PageGrid>
        <Flex>
          <VaultsMarketDropdown vaults={vaults} selectedVault={selectedVault} />
        </Flex>
        <VaultsChartCard market={market} />
        <VaultsMyLiquidityCard vault={selectedVault} />
        <VaultsStatsCard market={market} />
        <VaultInfoCardRow />
      </PageGrid>
    </Page>
  )
}

export default VaultsPageHelper
