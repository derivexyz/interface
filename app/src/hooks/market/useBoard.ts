import Lyra from '@lyrafinance/lyra-js'
import { Market } from '@lyrafinance/lyra-js'
import { Board } from '@lyrafinance/lyra-js'

import { useLyraFetch, useLyraMutate } from '../data/useLyraFetch'

export const fetchBoard = async (lyra: Lyra, marketAddressOrName: string, boardId: number): Promise<Board> =>
  await lyra.board(marketAddressOrName, boardId)

export default function useBoard(market: Market | null, boardId: number | null): Board | null {
  const [board] = useLyraFetch(
    'Board',
    market ? market.lyra : null,
    market && boardId ? [market.address, boardId] : null,
    fetchBoard
  )
  return board
}

export const useMutateBoard = (lyra: Lyra) => {
  return useLyraMutate('Board', lyra, fetchBoard)
}
