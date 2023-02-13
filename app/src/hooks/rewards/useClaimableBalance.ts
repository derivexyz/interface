import { ClaimableBalanceL2, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import { lyraArbitrum, lyraOptimism } from '@/app/utils/lyra'

import useNetwork from '../account/useNetwork'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const EMPTY: ClaimableBalanceL2 = {
  oldStkLyra: ZERO_BN,
  newStkLyra: ZERO_BN,
  op: ZERO_BN,
}

const fetchClaimableBalance = async (network: Network, account: string): Promise<ClaimableBalanceL2> => {
  switch (network) {
    case Network.Arbitrum:
      return await lyraArbitrum.account(account).claimableRewardsL2()
    case Network.Optimism:
      return await lyraOptimism.account(account).claimableRewardsL2()
  }
}

export default function useClaimableBalances(): ClaimableBalanceL2 {
  const network = useNetwork()
  const account = useWalletAccount()
  const [claimableBalance] = useFetch(
    FetchId.ClaimableBalanceL2,
    network && account ? [network, account] : null,
    fetchClaimableBalance
  )
  return claimableBalance ?? EMPTY
}

export const useMutateClaimableBalances = (): (() => Promise<ClaimableBalanceL2 | null>) => {
  const mutate = useMutate(FetchId.ClaimableBalanceL2, fetchClaimableBalance)
  const network = useNetwork()
  const account = useWalletAccount()
  return useCallback(async () => (account ? await mutate(network, account) : null), [mutate, account, network])
}
