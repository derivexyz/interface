import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchArrakisOptimismStaking, { ArrakisOpStaking } from '@/app/utils/rewards/fetchArrakisOptimismAccount'

import useWalletAccount from '../account/useWalletAccount'
import { useMutate } from '../data/useFetch'

export const useMutateArrakisOpStaking = (): (() => Promise<ArrakisOpStaking | null>) => {
  const mutate = useMutate(FetchId.ArrakisOptimismAccount, fetchArrakisOptimismStaking)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
