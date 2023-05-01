import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchLyraStaking from '@/app/utils/rewards/fetchLyraStaking'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

export default function useLyraStaking() {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.LyraStaking, [account], fetchLyraStaking)
  return data
}

export function useMutateLyraStaking() {
  const account = useWalletAccount()
  const mutate = useMutate(FetchId.LyraStaking, fetchLyraStaking)
  return useCallback(() => (account ? mutate(account) : null), [mutate, account])
}
