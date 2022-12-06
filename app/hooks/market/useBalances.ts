import { AccountBalances } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'
import { useCallback } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'

import lyra from '../../utils/lyra'
import useOptimismBlockFetch, { useOptimismBlockMutate } from '../data/useOptimismBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (account: string): Promise<AccountBalances[]> => {
  return await lyra.account(account).balances()
}

export const useMutateBalances = (): (() => Promise<AccountBalances[] | null>) => {
  const mutate = useOptimismBlockMutate('AccountBalances', fetcher)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(account)
    } else {
      return null
    }
  }, [mutate, account])
}

export default function useBalances(): AccountBalances[] {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  const [balances] = useOptimismBlockFetch('AccountBalances', [account], fetcher)
  return nullthrows(balances, 'Failed to fetch balances')
}
