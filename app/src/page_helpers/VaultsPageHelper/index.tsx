import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import { Vault } from '@/app/constants/vault'
import VaultsChartCard from '@/app/containers/vaults/VaultsChartCard'
import VaultsMarketDropdown from '@/app/containers/vaults/VaultsMarketDropdown'
import VaultsMyLiquidityCard from '@/app/containers/vaults/VaultsMyLiquidityCard'
import VaultsStatsCard from '@/app/containers/vaults/VaultsStatsCard'

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
      header={<VaultsMarketDropdown vaults={vaults} selectedVault={selectedVault} />}
      mobileCollapsedHeader={
        <Flex alignItems="center">
          <MarketImage mr={2} market={market} size={18} />
          <Text>{market.name.toUpperCase()} Vault</Text>
        </Flex>
      }
    >
      <PageGrid>
        <VaultsChartCard market={market} />
        <VaultsMyLiquidityCard vault={selectedVault} />
        <VaultsStatsCard market={market} />
        <VaultInfoCardRow />
      </PageGrid>
    </Page>
  )
}

export default VaultsPageHelper
