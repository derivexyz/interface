import { AccountLiquidityDepositBalance } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '../../utils/lyra'
import useOptimismBlockFetch, { useOptimismBlockMutate } from '../data/useOptimismBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (account: string, marketAddress: string): Promise<AccountLiquidityDepositBalance> => {
  return await lyra.account(account).liquidityDepositBalance(marketAddress)
}

export const useMutateLiquidityDepositBalance = () => {
  const mutate = useOptimismBlockMutate('AccountLiquidityDepositBalance', fetcher)
  const account = useWalletAccount()
  return useCallback(
    async (marketAddress: string) => {
      if (account) {
        return await mutate(account, marketAddress)
      } else {
        return null
      }
    },
    [mutate, account]
  )
}

export default function useLiquidityDepositBalance(marketAddress: string): AccountLiquidityDepositBalance | null {
  const account = useWalletAccount()
  const [balance] = useOptimismBlockFetch(
    'AccountLiquidityDepositBalance',
    account ? [account, marketAddress] : null,
    fetcher
  )
  return balance
}
