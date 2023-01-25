import { AccountLyraStaking } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const fetchLyraAccountStaking = async (account: string): Promise<AccountLyraStaking> => {
  return await lyraOptimism.account(account).lyraStaking()
}

export default function useLyraAccountStaking(): AccountLyraStaking | null {
  const account = useWalletAccount()
  const [accountStaking] = useFetch(FetchId.LyraAccountStaking, account ? [account] : null, fetchLyraAccountStaking)
  return accountStaking
}

export const useMutateAccountStaking = (): (() => Promise<AccountLyraStaking | null>) => {
  const mutate = useMutate(FetchId.LyraAccountStaking, fetchLyraAccountStaking)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(account)
    } else {
      return null
    }
  }, [mutate, account])
}
