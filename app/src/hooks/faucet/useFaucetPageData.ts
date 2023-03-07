import { AccountBalances, Network } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useNetwork from '../account/useNetwork'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

type FaucetRoot = {
  marketBalances: AccountBalances[]
  ethBalance: BigNumber
}

const fetchFaucetPageData = async (network: Network, owner: string): Promise<FaucetRoot> => {
  const lyra = getLyraSDK(network)
  const [marketBalances, ethBalance] = await Promise.all([
    lyra.account(owner).balances(),
    lyra.provider.getBalance(owner),
  ])
  return {
    marketBalances,
    ethBalance,
  }
}

const EMPTY: FaucetRoot = {
  marketBalances: [],
  ethBalance: ZERO_BN,
}

export default function useFaucetPageData(): FaucetRoot {
  const network = useNetwork()
  const owner = useWalletAccount()
  const [marketBalances] = useFetch(FetchId.FaucetPageData, owner ? [network, owner] : null, fetchFaucetPageData, {
    refreshInterval: 30 * 1000,
  })
  return marketBalances ?? EMPTY
}

export const useMutateFaucetPageData = () => {
  const network = useNetwork()
  const owner = useWalletAccount()
  const mutate = useMutate(FetchId.FaucetPageData, fetchFaucetPageData)
  return useCallback(() => (owner ? mutate(network, owner) : null), [mutate, network, owner])
}
