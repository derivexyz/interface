import { AccountLyraStaking } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '../../utils/lyra'
import useOptimismBlockFetch, { useOptimismBlockMutate } from '../data/useOptimismBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetchLyraAccountStaking = async (account: string): Promise<AccountLyraStaking> => {
  return await lyra.account(account).lyraStaking()
}

export default function useLyraAccountStaking(): AccountLyraStaking | null {
  const account = useWalletAccount()
  const [accountStaking] = useOptimismBlockFetch(
    'LyraAccountStaking',
    account ? [account] : null,
    fetchLyraAccountStaking
  )
  return accountStaking
}

export const useMutateAccountStaking = (): (() => Promise<AccountLyraStaking | null>) => {
  const mutate = useOptimismBlockMutate('LyraAccountStaking', fetchLyraAccountStaking)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(account)
    } else {
      return null
    }
  }, [mutate, account])
}
