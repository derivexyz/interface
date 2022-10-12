import { Board } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useOptimismBlockFetch from '../data/useOptimismBlockFetch'

const fetcher = async (marketAddressOrName: string) =>
  (await lyra.market(marketAddressOrName)).liveBoards().sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)

const EMPTY: Board[] = []

export default function useLiveBoards(marketAddressOrName: string | null): Board[] {
  const [boards] = useOptimismBlockFetch('LiveBoards', marketAddressOrName ? [marketAddressOrName] : null, fetcher)
  return boards ?? EMPTY
}
