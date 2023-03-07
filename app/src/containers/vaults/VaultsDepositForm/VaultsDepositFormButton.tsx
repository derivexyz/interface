import { BigNumber } from '@ethersproject/bignumber'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { MAX_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import { Vault } from '@/app/constants/vault'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import useMutateVaultDepositAndWithdraw from '@/app/hooks/mutations/useMutateVaultDepositAndWithdraw'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  vault: Vault
  amount: BigNumber
  onDeposit: () => void
} & MarginProps

const VaultsDepositFormButton = ({ vault, amount, onDeposit, ...styleProps }: Props) => {
  const { market, marketBalances } = vault
  const quoteAsset = marketBalances.quoteAsset
  const account = useWalletAccount()

  const mutateDeposit = useMutateVaultDepositAndWithdraw()

  const execute = useTransaction(market.lyra.network)
  const handleClickApprove = useCallback(async () => {
    if (!account) {
      console.warn('Account does not exist')
      return
    }
    const tx = market.approveDeposit(account, MAX_BN)
    await execute(tx, {
      onComplete: async () => {
        logEvent(LogEvent.VaultDepositApproveSuccess)
        await mutateDeposit()
      },
      onError: error => logEvent(LogEvent.VaultDepositApproveError, { error: error?.message }),
    })
  }, [account, market, execute, mutateDeposit])

  const handleClickDeposit = useCallback(async () => {
    if (!account || !market) {
      console.warn('Account does not exist')
      return
    }
    await execute(market.initiateDeposit(account, amount), {
      onComplete: async () => {
        logEvent(LogEvent.VaultDepositSuccess)
        await mutateDeposit()
        onDeposit()
      },
      onError: error => logEvent(LogEvent.VaultDepositError, { amount: amount, error: error?.message }),
    })
  }, [account, market, execute, amount, onDeposit, mutateDeposit])

  const insufficientBalance = quoteAsset.balance.lt(amount) || quoteAsset.balance.isZero()
  const insufficientAllowance = quoteAsset.depositAllowance.lt(amount) || quoteAsset.depositAllowance.isZero()

  return (
    <TransactionButton
      network={market.lyra.network}
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
