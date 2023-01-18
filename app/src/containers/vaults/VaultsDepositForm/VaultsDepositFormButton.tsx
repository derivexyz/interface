import { BigNumber } from '@ethersproject/bignumber'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { MAX_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useAccount from '@/app/hooks/market/useAccount'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import { useMutateVaultBalance, VaultBalance } from '@/app/hooks/vaults/useVaultBalance'
import { useMutateVaultsTableData } from '@/app/hooks/vaults/useVaultsTableData'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  vaultBalance: VaultBalance
  amount: BigNumber
  onDeposit: () => void
} & MarginProps

const VaultsDepositFormButton = ({ vaultBalance, amount, onDeposit, ...styleProps }: Props) => {
  const { market, marketBalances } = vaultBalance
  const quoteAsset = marketBalances.quoteAsset
  const account = useAccount(market.lyra.network)

  const mutateVaultBalance = useMutateVaultBalance(market.lyra)
  const mutateVaultsTableData = useMutateVaultsTableData()

  const mutateBalance = useCallback(
    async () =>
      await Promise.all([
        mutateVaultBalance(market.address, account?.address),
        mutateVaultsTableData(account?.address),
      ]),
    [account?.address, market.address, mutateVaultBalance, mutateVaultsTableData]
  )

  const execute = useTransaction(market.lyra.network)
  const handleClickApprove = useCallback(async () => {
    if (!account) {
      console.warn('Account does not exist')
      return
    }
    const tx = await account.approveDeposit(market.address, MAX_BN)
    await execute(tx, {
      onComplete: async () => {
        logEvent(LogEvent.VaultDepositApproveSuccess)
        await mutateBalance()
      },
      onError: error => logEvent(LogEvent.VaultDepositApproveError, { error: error?.message }),
    })
  }, [account, market.address, execute, mutateBalance])

  const handleClickDeposit = useCallback(async () => {
    if (!account || !market) {
      console.warn('Account does not exist')
      return
    }
    await execute(market.deposit(account.address, amount), {
      onComplete: async () => {
        logEvent(LogEvent.VaultDepositSuccess)
        await mutateBalance()
        onDeposit()
      },
      onError: error => logEvent(LogEvent.VaultDepositError, { amount: amount, error: error?.message }),
    })
  }, [account, market, execute, amount, onDeposit, mutateBalance])

  const insufficientBalance = quoteAsset.balance.lt(amount) || quoteAsset.balance.isZero()
  const insufficientAllowance = quoteAsset.depositAllowance.lt(amount) || quoteAsset.depositAllowance.isZero()

  return (
    <TransactionButton
      network={vaultBalance.market.lyra.network}
      transactionType={TransactionType.VaultDeposit}
      width="100%"
      isDisabled={insufficientAllowance || insufficientBalance || amount.lte(0)}
      label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Deposit'}
      onClick={handleClickDeposit}
      requireAllowance={
        !insufficientBalance && insufficientAllowance
          ? {
              ...market.quoteToken,
              onClick: handleClickApprove,
            }
          : undefined
      }
      {...styleProps}
    />
  )
}

export default VaultsDepositFormButton
