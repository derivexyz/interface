import { AccountWethLyraStakingL2 } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const fetchAccountWethLyraStakingL2 = async (account: string): Promise<AccountWethLyraStakingL2> => {
  return await lyraOptimism.account(account).wethLyraStakingL2()
}

export default function useAccountWethLyraStakingL2(): AccountWethLyraStakingL2 | null {
  const account = useWalletAccount()
  const [accountStaking] = useFetch(
    FetchId.AccountWethLyraStakingL2,
    account ? [account] : null,
    fetchAccountWethLyraStakingL2
  )
  return accountStaking
}

export const useMutateAccountWethLyraStakingL2 = (): (() => Promise<AccountWethLyraStakingL2 | null>) => {
  const mutate = useMutate(FetchId.AccountWethLyraStakingL2, fetchAccountWethLyraStakingL2)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
