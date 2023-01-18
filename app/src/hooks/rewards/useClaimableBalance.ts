import { ClaimableBalanceL2 } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { lyraOptimism } from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const EMPTY: ClaimableBalanceL2 = {
  oldStkLyra: ZERO_BN,
  newStkLyra: ZERO_BN,
  op: ZERO_BN,
}

const fetchClaimableBalance = async (account: string): Promise<ClaimableBalanceL2> =>
  await lyraOptimism.account(account).claimableRewardsL2()

export default function useClaimableBalances(): ClaimableBalanceL2 {
  const account = useWalletAccount()
  const [claimableBalance] = useFetch('ClaimableBalance', account ? [account] : null, fetchClaimableBalance)
  return claimableBalance ?? EMPTY
}

export const useMutateClaimableBalances = (): (() => Promise<ClaimableBalanceL2 | null>) => {
  const mutate = useMutate('ClaimableBalance', fetchClaimableBalance)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
