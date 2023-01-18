import { Market, Network } from '@lyrafinance/lyra-js'

import { IGNORE_MARKETS_LIST } from '@/app/constants/ignore'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch, { useMutate } from '../data/useFetch'

export const fetchMarkets = async (): Promise<Market[]> => {
  const networkMarkets = await Promise.all(Object.values(Network).map(network => getLyraSDK(network).markets()))
  return networkMarkets
    .flat()
    .filter(m => !IGNORE_MARKETS_LIST.find(i => i.marketName === m.name && i.chain === m.lyra.chain))
}

const EMPTY: Market[] = []

export default function useMarkets(): Market[] {
  const [markets] = useFetch('Markets', [], fetchMarkets)
  return markets ?? EMPTY
}

export const useMutateMarkets = (): (() => Promise<Market[] | null>) => {
  return useMutate('Markets', fetchMarkets)
}
