import withSuspense from '@lyra/app/hooks/data/withSuspense'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import VaultsPendingDepositsTableOrList from '@/app/components/common/VaultsPendingDepositsTableOrList'
import VaultsPendingWithdrawalsTableOrList from '@/app/components/common/VaultsPendingWithdrawalsTableOrList'
import VaultsMyLiquiditySection from '@/app/components/vaults/VaultsMyLiquiditySection'
import useVaultBalance from '@/app/hooks/vaults/useVaultBalance'

type Props = {
  marketAddressOrName: string
} & MarginProps &
  LayoutProps &
  PaddingProps

const VaultsMyLiquidityCard = withSuspense(({ marketAddressOrName, ...styleProps }: Props) => {
  const vaultBalance = useVaultBalance(marketAddressOrName)
  if (!vaultBalance) {
    return null
  }
  const liquidityBalance = vaultBalance.balance
  const liquidityDeposits = vaultBalance.deposits
  const liquidityWithdrawals = vaultBalance.withdrawals

  if (liquidityBalance.balance.isZero() && liquidityDeposits.length === 0 && liquidityWithdrawals.length === 0) {
    return null
  }
  return (
    <Card {...styleProps}>
      <VaultsMyLiquiditySection vaultBalance={vaultBalance} />
      {liquidityDeposits.length ? (
        <CardSection noPadding>
          <Text variant="heading" mx={6} mt={6}>
            Depositing
          </Text>
          <VaultsPendingDepositsTableOrList deposits={liquidityDeposits} />
        </CardSection>
      ) : null}
      {liquidityWithdrawals.length ? (
        <CardSection noPadding>
          <Text variant="heading" mx={6} mt={6}>
            Withdrawing
          </Text>
          <VaultsPendingWithdrawalsTableOrList withdrawals={liquidityWithdrawals} />
        </CardSection>
      ) : null}
    </Card>
  )
})

export default VaultsMyLiquidityCard
