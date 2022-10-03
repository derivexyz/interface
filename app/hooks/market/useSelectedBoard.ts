import { Board, Market } from '@lyrafinance/lyra-js'
import { useCallback, useMemo } from 'react'

import useNumberQueryParam from '../url/useNumberQueryParam'

export default function useSelectedBoard(market: Market): [Board | null, (board: Board | null) => void] {
  const timestamp = market.block.timestamp
  const liveBoards = useMemo(() => market.liveBoards().sort((a, b) => a.expiryTimestamp - b.expiryTimestamp), [market])

  const defaultBoard = useMemo(
    () => liveBoards.find(board => board.tradingCutoffTimestamp > timestamp) ?? null,
    [liveBoards, timestamp]
  )

  const [queryBoardIdOrExpiryTimestamp, setQueryBoardIdOrExpiryTimestamp] = useNumberQueryParam('expiry')
  const queryBoard = useMemo(
    () =>
      liveBoards.find(
        b => b.id === queryBoardIdOrExpiryTimestamp || b.expiryTimestamp === queryBoardIdOrExpiryTimestamp
      ) ?? null,
    [queryBoardIdOrExpiryTimestamp, liveBoards]
  )

  const setBoard = useCallback(
    (board: Board | null) => {
      if (board && board.id !== defaultBoard?.id) {
        setQueryBoardIdOrExpiryTimestamp(board.expiryTimestamp)
      } else {
        setQueryBoardIdOrExpiryTimestamp(null)
      }
    },
    [setQueryBoardIdOrExpiryTimestamp, defaultBoard]
  )

  // default to query board ID, backup to default board ID
  const board = queryBoard ?? defaultBoard ?? null
  return [board, setBoard]
}
