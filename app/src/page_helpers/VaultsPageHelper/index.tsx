import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import VaultsChartCard from '@/app/containers/vaults/VaultsChartCard'
import VaultsMarketDropdown from '@/app/containers/vaults/VaultsMarketDropdown'
import VaultsMyLiquidityCard from '@/app/containers/vaults/VaultsMyLiquidityCard'
import VaultsStatsCard from '@/app/containers/vaults/VaultsStatsCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  market: Market
}

const VaultsPageHelper = ({ market }: Props) => {
  return (
    <Page
      header={<VaultsMarketDropdown selectedMarket={market} />}
      mobileCollapsedHeader={
        <Flex alignItems="center">
          <MarketImage mr={2} market={market} size={18} />
          <Text>{market.name.toUpperCase()} Vault</Text>
        </Flex>
      }
    >
      <PageGrid>
        <VaultsChartCard market={market} />
        <VaultsMyLiquidityCard market={market} />
        <VaultsStatsCard market={market} />
        <VaultInfoCardRow />
      </PageGrid>
    </Page>
  )
}

export default VaultsPageHelper
