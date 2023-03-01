import { AccountWethLyraStaking } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const fetchAccountWethLyraStaking = async (account: string): Promise<AccountWethLyraStaking> => {
  return await lyraOptimism.wethLyraStakingAccount(account)
}

export default function useAccountWethLyraStaking(): AccountWethLyraStaking | null {
  const account = useWalletAccount()
  const [accountStaking] = useFetch(
    FetchId.WethLyraStakingAccount,
    account ? [account] : null,
    fetchAccountWethLyraStaking
  )
  return accountStaking
}

export const useMutateAccountWethLyraStaking = (): (() => Promise<AccountWethLyraStaking | null>) => {
  const mutate = useMutate(FetchId.WethLyraStakingAccount, fetchAccountWethLyraStaking)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
