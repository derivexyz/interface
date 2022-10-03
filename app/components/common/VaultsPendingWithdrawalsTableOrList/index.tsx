import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { LiquidityWithdrawal } from '@lyrafinance/lyra-js'
import React from 'react'

import VaultsPendingWithdrawalsListMobile from './VaultsPendingWithdrawalsListMobile'
import VaultsPendingWithdrawalsTableDesktop from './VaultsPendingWithdrawalsTableDesktop'

export type VaultsPendingWithdrawalsTableOrListProps = {
  withdrawals: LiquidityWithdrawal[]
  onClick?: (withdrawal: LiquidityWithdrawal) => void
} & MarginProps &
  LayoutProps

const VaultsPendingWithdrawalsTableOrList = (props: VaultsPendingWithdrawalsTableOrListProps) => {
  const isMobile = useIsMobile()
  return isMobile ? (
    <VaultsPendingWithdrawalsListMobile {...props} />
  ) : (
    <VaultsPendingWithdrawalsTableDesktop {...props} />
  )
}

export default VaultsPendingWithdrawalsTableOrList
