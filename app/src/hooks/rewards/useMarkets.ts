import { Market } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import fetchMarkets from '@/app/utils/fetchMarkets'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (): Promise<Market[]> => {
  return await fetchMarkets()
}

const EMPTY: Market[] = []

export default function useMarkets(): Market[] {
  const [markets] = useFetch(FetchId.Markets, [], fetcher)
  return markets ?? EMPTY
}

export const useMutateMarkets = (): (() => Promise<Market[] | null>) => {
  return useMutate(FetchId.Markets, fetcher)
}
