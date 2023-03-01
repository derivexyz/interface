import { AccountBalances, Market, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'
import { useMemo } from 'react'

import { ZERO_ADDRESS, ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

export const fetchMarketBalances = async (
  network: Network,
  marketAddress: string,
  account: string
): Promise<AccountBalances | null> => {
  const balances = await getLyraSDK(network).account(account).balances()
  const marketBalance = balances.find(balance => balance.marketAddress === marketAddress)
  return marketBalance ?? null
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
    account ? [market.lyra.network, market.address, account] : null,
    fetchMarketBalances,
    { refreshInterval: 10 * 1000 } // 10 seconds
  )
  return useMemo(() => balances ?? getEmpty(ZERO_ADDRESS, market), [balances, market])
}

export const useMutateTradeBalances = (market: Market): (() => Promise<AccountBalances | null>) => {
  const mutate = useMutate(FetchId.AccountBalances, fetchMarketBalances)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(market.lyra.network, market.address, account)
    } else {
      return null
    }
  }, [mutate, account, market])
}
