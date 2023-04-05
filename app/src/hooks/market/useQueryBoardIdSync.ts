import { Market } from '@lyrafinance/lyra-js'
import { useCallback, useEffect, useMemo } from 'react'

import useNumberQueryParam from '../url/useNumberQueryParam'

export default function useQueryBoardIdSync(market: Market): [number | null, (board: number | null) => void] {
  const [queryBoardIdOrExpiryTimestamp, setQueryBoardIdOrExpiryTimestamp] = useNumberQueryParam('expiry')

  const board = useMemo(
    () =>
      market
        .liveBoards()
        .find(b => b.id === queryBoardIdOrExpiryTimestamp || b.expiryTimestamp === queryBoardIdOrExpiryTimestamp) ??
      null,
    [queryBoardIdOrExpiryTimestamp, market]
  )

  const defaultBoard = useMemo(() => {
    return (
      market
        .liveBoards()
        .sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)
        .find(board => !board.isTradingCutoff) ?? null
    )
  }, [market])

  const setBoard = useCallback(
    (boardId: number | null) => {
      const board = boardId ? market.liveBoards().find(b => b.id === boardId) : null
      if (board) {
        setQueryBoardIdOrExpiryTimestamp(board.expiryTimestamp)
      } else {
        setQueryBoardIdOrExpiryTimestamp(null)
      }
    },
    [market, setQueryBoardIdOrExpiryTimestamp]
  )

  const boardId = board?.id ?? defaultBoard?.id ?? null

  // set or reset board query param when market changes
  useEffect(() => {
    setBoard(boardId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market.address])

  return useMemo(() => [boardId, setBoard], [boardId, setBoard])
}
