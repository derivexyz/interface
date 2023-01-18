import { AccountBalances, Network } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'
import { useCallback } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useL2BlockFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (network: Network, account: string): Promise<AccountBalances[]> => {
  return await getLyraSDK(network).account(account).balances()
}

export const useMutateBalances = (network: Network): (() => Promise<AccountBalances[] | null>) => {
  const mutate = useMutate('AccountBalances', fetcher)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(network, account)
    } else {
      return null
    }
  }, [mutate, account, network])
}

export default function useBalances(network: Network | null): AccountBalances[] {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  const [balances] = useL2BlockFetch('AccountBalances', network ? [network, account] : null, fetcher)
  return nullthrows(balances, 'Failed to fetch balances')
}
