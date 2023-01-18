import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import { useMutateVaultBalance, VaultBalance } from '@/app/hooks/vaults/useVaultBalance'
import { useMutateVaultsTableData } from '@/app/hooks/vaults/useVaultsTableData'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  vaultBalance: VaultBalance
  amount: BigNumber
  onWithdraw: () => void
} & MarginProps

const VaultsWithdrawFormButton = withSuspense(
  ({ vaultBalance, amount, onWithdraw, ...styleProps }: Props) => {
    const { market } = vaultBalance
    const account = useAccount(market.lyra.network)
    const execute = useTransaction(market.lyra.network)

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

    const handleClickWithdraw = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return
      }
      await execute(market.withdraw(account.address, amount), {
        onComplete: async () => {
          logEvent(LogEvent.VaultWithdrawSuccess)
          await mutateBalance()
        },
        onError: error => logEvent(LogEvent.VaultWithdrawError, { amount: amount, error: error?.message }),
      })
      onWithdraw()
    }, [onWithdraw, account, amount, execute, market, mutateBalance])

    const lpBalance = vaultBalance.liquidityToken.balance

    const insufficientBalance = lpBalance.lt(amount)

    return (
      <Box {...styleProps}>
        <TransactionButton
          network={vaultBalance.market.lyra.network}
          transactionType={TransactionType.VaultWithdraw}
          width="100%"
          isDisabled={insufficientBalance || amount.lte(0)}
          label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Withdraw'}
          onClick={handleClickWithdraw}
        />
      </Box>
    )
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default VaultsWithdrawFormButton
