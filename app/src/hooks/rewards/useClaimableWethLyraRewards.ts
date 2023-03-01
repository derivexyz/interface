import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const fetchClaimableWethLyraRewards = async (account: string): Promise<BigNumber> =>
  await lyraOptimism.claimableWethLyraRewards(account)

export default function useClaimableWethLyraRewards(): BigNumber {
  const account = useWalletAccount()
  const [claimableBalance] = useFetch(
    FetchId.ClaimableWethLyraRewards,
    account ? [account] : null,
    fetchClaimableWethLyraRewards
  )
  return claimableBalance ?? ZERO_BN
}

export const useMutateClaimableStakingRewards = (): (() => Promise<BigNumber | null>) => {
  const mutate = useMutate(FetchId.ClaimableWethLyraRewards, fetchClaimableWethLyraRewards)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
