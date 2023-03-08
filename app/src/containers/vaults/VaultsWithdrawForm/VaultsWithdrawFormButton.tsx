import { BigNumber } from '@ethersproject/bignumber'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import { Vault } from '@/app/constants/vault'
import useAccount from '@/app/hooks/account/useAccount'
import useTransaction from '@/app/hooks/account/useTransaction'
import useMutateVaultDepositAndWithdraw from '@/app/hooks/mutations/useMutateVaultDepositAndWithdraw'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  vault: Vault
  amount: BigNumber
  onWithdraw: () => void
} & MarginProps

const VaultsWithdrawFormButton = ({ vault, amount, onWithdraw, ...styleProps }: Props) => {
  const { market } = vault
  const account = useAccount(market.lyra.network)
  const execute = useTransaction(market.lyra.network)

  const mutateWithdraw = useMutateVaultDepositAndWithdraw()

  const handleClickWithdraw = useCallback(async () => {
    if (!account) {
      console.warn('Account does not exist')
      return
    }
    await execute(market.initiateWithdraw(account.address, amount), TransactionType.VaultWithdraw, {
      onComplete: async () => {
        logEvent(LogEvent.VaultWithdrawSuccess)
        await mutateWithdraw()
      },
      onError: error => logEvent(LogEvent.VaultWithdrawError, { amount: amount, error: error?.message }),
    })
    onWithdraw()
  }, [onWithdraw, account, amount, execute, market, mutateWithdraw])

  const lpBalance = vault.liquidityToken.balance

  const insufficientBalance = lpBalance.lt(amount)

  return (
    <TransactionButton
      {...styleProps}
      network={market.lyra.network}
      transactionType={TransactionType.VaultWithdraw}
      width="100%"
      isDisabled={insufficientBalance || amount.lte(0)}
      label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Withdraw'}
      onClick={handleClickWithdraw}
    />
  )
}

export default VaultsWithdrawFormButton
