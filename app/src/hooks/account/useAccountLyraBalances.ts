import { AccountLyraBalances, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'
import useNetwork from './useNetwork'

const fetcher = async (network: Network, account: string): Promise<AccountLyraBalances | null> =>
  await getLyraSDK(network).account(account).lyraBalances()

export const EMPTY_LYRA_BALANCES: AccountLyraBalances = {
  ethereumLyra: ZERO_BN,
  optimismLyra: ZERO_BN,
  arbitrumLyra: ZERO_BN,
  optimismOldStkLyra: ZERO_BN,
  ethereumStkLyra: ZERO_BN,
  optimismStkLyra: ZERO_BN,
  arbitrumStkLyra: ZERO_BN,
  stakingAllowance: ZERO_BN,
}

export default function useAccountLyraBalances(): AccountLyraBalances {
  const account = useWalletAccount()
  const network = useNetwork()
  const [balances] = useFetch(
    FetchId.AccountLyraBalances,
    account ? [network, account] : null,
    fetcher,
    { refreshInterval: 10 * 1000 } // 10 seconds
  )
  return balances ?? EMPTY_LYRA_BALANCES
}

export const useMutateAccountLyraBalances = (): (() => Promise<AccountLyraBalances | null>) => {
  const mutate = useMutate(FetchId.AccountLyraBalances, fetcher)
  const account = useWalletAccount()
  const network = useNetwork()
  return useCallback(async () => {
    if (account) {
      return await mutate(network, account)
    } else {
      return null
    }
  }, [mutate, account, network])
}
