import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchArrakisStaking, { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import useWalletAccount from '../account/useWalletAccount'
import { useMutate } from '../data/useFetch'

export const useMutateArrakisStaking = (): (() => Promise<ArrakisStaking | null>) => {
  const mutate = useMutate(FetchId.ArrakisStaking, fetchArrakisStaking)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
