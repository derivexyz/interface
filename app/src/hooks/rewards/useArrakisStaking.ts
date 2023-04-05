import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchArrakisStaking, { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

export default function useArrakisStaking() {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.ArrakisStaking, [account], fetchArrakisStaking)
  return data
}

export const useMutateArrakisStaking = (): (() => Promise<ArrakisStaking | null>) => {
  const mutate = useMutate(FetchId.ArrakisStaking, fetchArrakisStaking)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
