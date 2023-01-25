import { ClaimableBalanceL1 } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const EMPTY: ClaimableBalanceL1 = {
  newStkLyra: ZERO_BN,
}

const fetchClaimableBalanceL1 = async (account: string): Promise<ClaimableBalanceL1> =>
  await lyraOptimism.account(account).claimableRewardsL1()

export default function useClaimableBalancesL1(): ClaimableBalanceL1 {
  const account = useWalletAccount()
  const [claimableBalance] = useFetch(FetchId.ClaimableBalanceL1, account ? [account] : null, fetchClaimableBalanceL1)
  return claimableBalance ?? EMPTY
}

export const useMutateClaimableBalancesL1 = (): (() => Promise<ClaimableBalanceL1 | null>) => {
  const mutate = useMutate(FetchId.ClaimableBalanceL1, fetchClaimableBalanceL1)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
