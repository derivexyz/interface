import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import { useMutateBalances } from '@/app/hooks/market/useBalances'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import useVaultBalance from '@/app/hooks/vaults/useVaultBalance'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  market: Market
  amount: BigNumber
} & MarginProps

const VaultsWithdrawFormButton = withSuspense(
  ({ market, amount, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const vault = useVaultBalance(market.address)
    const account = useAccount()
    const mutateAccount = useMutateBalances()
    const execute = useTransaction()

    const handleClickWithdraw = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      setIsLoading(true)
      await execute(market.withdraw(account.address, amount), {
        onComplete: () => Promise.all([mutateAccount()]),
      })
      setIsLoading(false)
    }, [account, amount, execute, market, mutateAccount])

    const lpBalance = vault?.balances.liquidityToken.balance ?? ZERO_BN

    const insufficientBalance = lpBalance.lt(amount)

    return (
      <Box {...styleProps}>
        <TransactionButton
          transactionType={TransactionType.VaultWithdraw}
          size="lg"
          sx={{ width: '100%' }}
          variant="primary"
          isDisabled={insufficientBalance || amount.lte(0)}
          isLoading={isLoading}
          label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Withdraw'}
          onClick={handleClickWithdraw}
        />
      </Box>
    )
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default VaultsWithdrawFormButton
