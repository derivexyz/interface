import Lyra from '@lyrafinance/lyra-js'
import { Board, Market } from '@lyrafinance/lyra-js'

import { useLyraFetch } from '../data/useLyraFetch'

const fetcher = async (lyra: Lyra, marketAddressOrName: string) => {
  return (await lyra.market(marketAddressOrName)).liveBoards().sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)
}

const EMPTY: Board[] = []

export default function useLiveBoards(market: Market | null): Board[] {
  const [boards] = useLyraFetch('LiveBoards', market ? market.lyra : null, market ? [market.address] : null, fetcher)
  return boards ?? EMPTY
}
