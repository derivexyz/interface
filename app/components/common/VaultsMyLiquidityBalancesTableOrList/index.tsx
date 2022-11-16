import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import { MarketsLiquidity } from '@/app/hooks/market/useMarketsLiquidity'
import { VaultBalance } from '@/app/hooks/vaults/useVaultBalance'

import VaultsMyLiquidityBalancesListMobile from './VaultsMyLiquidityBalancesListMobile'
import VaultsMyLiquidityBalancesTableDesktop from './VaultsMyLiquidityBalancesTableDesktop'

export type VaultsMyLiquidityBalancesTableOrListProps = {
  vaultBalances: VaultBalance[]
  marketsLiquidity: MarketsLiquidity | null
  onClick?: (vaultBalance: VaultBalance) => void
} & MarginProps &
  LayoutProps

const VaultsMyLiquidityBalancesTableOrList = (props: VaultsMyLiquidityBalancesTableOrListProps) => {
  const isMobile = useIsMobile()
  return !isMobile ? (
    <VaultsMyLiquidityBalancesTableDesktop {...props} />
  ) : (
    <VaultsMyLiquidityBalancesListMobile {...props} />
  )
}

export default VaultsMyLiquidityBalancesTableOrList
