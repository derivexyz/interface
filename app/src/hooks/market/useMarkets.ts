import { Market } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch, { useMutate } from '../data/useFetch'

export const fetchMarkets = async (): Promise<Market[]> => await lyra.markets()

const EMPTY: Market[] = []

export default function useMarkets(): Market[] {
  const [markets] = useFetch('Markets', [], fetchMarkets)
  return markets ?? EMPTY
}

export const useMutateMarkets = (): (() => Promise<Market[] | null>) => {
  return useMutate('Markets', fetchMarkets)
}
