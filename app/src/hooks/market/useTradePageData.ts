import { Market, Network, Position, Version } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { FetchId } from '@/app/constants/fetch'
import coerce from '@/app/utils/coerce'
import fetchMarkets from '@/app/utils/fetchMarkets'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getPageHeartbeat from '@/app/utils/getPageHeartbeat'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

type TradeRoot = {
  markets: Market[]
  openPositions: Position[]
}

const fetchTradePageData = async (network: Network, owner: string | null): Promise<TradeRoot> => {
  const maybeFetchPositions = async (): Promise<Position[]> => (owner ? getLyraSDK(network).openPositions(owner) : [])
  const [markets, openPositions] = await Promise.all([fetchMarkets([network]), maybeFetchPositions()])
  return {
    markets: markets.filter(m => m.lyra.version !== Version.Avalon),
    openPositions: openPositions.sort((a, b) => a.expiryTimestamp - b.expiryTimestamp),
  }
}

const EMPTY: TradeRoot = {
  markets: [],
  openPositions: [],
}

export default function useTradePageData(): TradeRoot {
  const { network: networkStr } = useParams()
  const network = coerce(Network, networkStr) ?? null

  const owner = useWalletAccount()

  const [markets] = useFetch(FetchId.TradePageData, network ? [network, owner] : null, fetchTradePageData, {
    refreshInterval: network ? getPageHeartbeat(network) : undefined,
  })

  return markets ?? EMPTY
}

export const useMutateTradePageData = () => {
  const { network: networkStr } = useParams()
  const network = coerce(Network, networkStr) ?? null

  const owner = useWalletAccount()

  const mutate = useMutate(FetchId.TradePageData, fetchTradePageData)
  return useCallback(() => (network ? mutate(network, owner) : null), [mutate, network, owner])
}
