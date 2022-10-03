import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import { VaultBalance } from '@/app/hooks/vaults/useVaultBalance'

import VaultsMyLiquidityBalancesListMobile from './VaultsMyLiquidityBalancesListMobile'
import VaultsMyLiquidityBalancesTableDesktop from './VaultsMyLiquidityBalancesTableDesktop'

export type VaultsMyLiquidityBalancesTableOrListProps = {
  vaultBalances: VaultBalance[]
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
