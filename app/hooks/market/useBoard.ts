import { Board } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '../../utils/lyra'
import useFetch, { useMutate } from '../data/useFetch'

export const fetchBoard = async (marketAddressOrName: string, boardId: number): Promise<Board> =>
  await lyra.board(marketAddressOrName, boardId)

export default function useBoard(marketAddressOrName: string | null, boardId: number | null): Board | null {
  const [board] = useFetch('Board', marketAddressOrName && boardId ? [marketAddressOrName, boardId] : null, fetchBoard)
  return board
}

export const useMutateBoard = (
  marketAddressOrName: string | null,
  boardId: number | null
): (() => Promise<Board | null>) => {
  const mutate = useMutate('Board', fetchBoard)
  return useCallback(
    async () => (marketAddressOrName && boardId ? await mutate(marketAddressOrName, boardId) : null),
    [mutate, marketAddressOrName, boardId]
  )
}
