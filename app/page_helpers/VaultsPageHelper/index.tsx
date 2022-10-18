import Card from '@lyra/ui/components/Card'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import VaultInfoCardRow from '@/app/components/common/VaultInfoCardRow'
import VaultsDepositAndWithdrawForm from '@/app/containers/vaults/VaultsDepositAndWithdrawForm'
import VaultsMarketDropdown from '@/app/containers/vaults/VaultsMarketDropdown'
import VaultsMyLiquidityCard from '@/app/containers/vaults/VaultsMyLiquidityCard'
import VaultsStatsCard from '@/app/containers/vaults/VaultsStatsCard'
import VaultsStatsChartCard from '@/app/containers/vaults/VaultsStatsChartCard'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

type Props = {
  market: Market
}

const VaultsPageHelper = ({ market }: Props) => {
  const [isDeposit, setIsDeposit] = useState(true)

  const header = <VaultsMarketDropdown selectedMarket={market} />

  return (
    <Layout
      desktopHeader={header}
      desktopRightColumn={
        <Card overflowY="auto" overflowX="hidden">
          <VaultsDepositAndWithdrawForm
            marketAddressOrName={market.address}
            isDeposit={isDeposit}
            onToggleDeposit={setIsDeposit}
          />
        </Card>
      }
      mobileHeader={header}
      mobileCollapsedHeader={
        <Flex alignItems="center">
          <MarketImage mr={2} name={market.name} size={18} />
          <Text>{market.name.toUpperCase()} Vault</Text>
        </Flex>
      }
    >
      <LayoutGrid>
        <VaultsStatsChartCard marketAddressOrName={market.address} />
        <VaultsMyLiquidityCard marketAddressOrName={market.address} />
        <VaultsStatsCard marketAddressOrName={market.address} />
        <VaultInfoCardRow />
      </LayoutGrid>
    </Layout>
  )
}

export default VaultsPageHelper
