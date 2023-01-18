import { AccountWethLyraStaking } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { lyraOptimism } from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetchAccountWethLyraStaking = async (account: string): Promise<AccountWethLyraStaking> => {
  return await lyraOptimism.account(account).wethLyraStaking()
}

export default function useAccountWethLyraStaking(): AccountWethLyraStaking | null {
  const account = useWalletAccount()
  const [accountStaking] = useFetch('AccountWethLyraStaking', account ? [account] : null, fetchAccountWethLyraStaking)
  return accountStaking
}

export const useMutateAccountWethLyraStaking = (): (() => Promise<AccountWethLyraStaking | null>) => {
  const mutate = useMutate('AccountWethLyraStaking', fetchAccountWethLyraStaking)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
