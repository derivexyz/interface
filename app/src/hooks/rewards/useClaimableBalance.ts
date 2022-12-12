import { ClaimableBalance } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'

import lyra from '../../utils/lyra'
import useOptimismBlockFetch, { useOptimismBlockMutate } from '../data/useOptimismBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetchClaimableBalance = async (account: string): Promise<ClaimableBalance> =>
  await lyra.account(account).claimableRewards()

const EMPTY: ClaimableBalance = {
  lyra: ZERO_BN,
  stkLyra: ZERO_BN,
  op: ZERO_BN,
}

export default function useClaimableBalances(): ClaimableBalance {
  const account = useWalletAccount()
  const [claimableBalance] = useOptimismBlockFetch(
    'ClaimableBalance',
    account ? [account] : null,
    fetchClaimableBalance
  )
  return claimableBalance ?? EMPTY
}

export const useMutateClaimableBalances = (): (() => Promise<ClaimableBalance | null>) => {
  const mutate = useOptimismBlockMutate('ClaimableBalance', fetchClaimableBalance)
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(account) : null), [mutate, account])
}
