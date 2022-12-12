import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { LiquidityDeposit } from '@lyrafinance/lyra-js'
import React from 'react'

import VaultsPendingDepositsListMobile from './VaultsPendingDepositsListMobile'
import VaultsPendingDepositsTableDesktop from './VaultsPendingDepositsTableDesktop'

export type VaultsPendingDepositsTableOrListProps = {
  deposits: LiquidityDeposit[]
  onClick?: (deposit: LiquidityDeposit) => void
} & MarginProps &
  LayoutProps

const VaultsPendingDepositsTableOrList = (props: VaultsPendingDepositsTableOrListProps) => {
  const isMobile = useIsMobile()
  return isMobile ? <VaultsPendingDepositsListMobile {...props} /> : <VaultsPendingDepositsTableDesktop {...props} />
}

export default VaultsPendingDepositsTableOrList
