import { Market } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

export const fetchMarkets = async (): Promise<Market[]> => await lyra.markets()

const EMPTY: Market[] = []

export default function useMarkets(): Market[] {
  const [markets] = useFetch('Markets', [], fetchMarkets)
  return markets ?? EMPTY
}
