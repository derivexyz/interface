import { AccountBalances, Market, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'
import { useMemo } from 'react'

import { ZERO_ADDRESS, ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (network: Network, account: string): Promise<AccountBalances[]> => {
  return await getLyraSDK(network).account(account).balances()
}

const getEmpty = (owner: string, market: Market): AccountBalances => ({
  owner,
  market,
  marketAddress: market.address,
  marketName: market.name,
  quoteAsset: {
    ...market.quoteToken,
    balance: ZERO_BN,
    tradeAllowance: ZERO_BN,
    depositAllowance: ZERO_BN,
  },
  baseAsset: {
    ...market.baseToken,
    balance: ZERO_BN,
    tradeAllowance: ZERO_BN,
  },
  liquidityToken: {
    ...market.liquidityToken,
    balance: ZERO_BN,
  },
})

export default function useAccountBalances(market: Market): AccountBalances {
  const account = useWalletAccount()
  const [balances] = useFetch(
    FetchId.AccountBalances,
    account ? [market.lyra.network, account] : null,
    fetcher,
    { refreshInterval: 10 * 1000 } // 10 seconds
  )
  return useMemo(() => {
    const emptyBalance = getEmpty(ZERO_ADDRESS, market)
    if (balances) {
      return balances.find(b => b.marketAddress === market.address) ?? emptyBalance
    } else {
      return emptyBalance
    }
  }, [balances, market])
}

export const useMutateAccountBalances = (network: Network): (() => Promise<AccountBalances[]>) => {
  const mutate = useMutate(FetchId.AccountBalances, fetcher)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return (await mutate(network, account)) ?? []
    } else {
      return []
    }
  }, [account, mutate, network])
}
