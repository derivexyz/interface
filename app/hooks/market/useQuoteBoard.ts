import { BigNumber } from '@ethersproject/bignumber'
import lyra from '@lyra/app/utils/lyra'
import { Board, Option, Quote } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import useOptimismBlockFetch from '../data/useOptimismBlockFetch'

const fetcher = async (marketAddressOrName: string, boardId: number, size: BigNumber) =>
  (await lyra.quoteBoard(marketAddressOrName, boardId, BigNumber.from(size))).sort((a, b) =>
    a.option.strike().strikePrice.gt(b.option.strike().strikePrice) ? 1 : -1
  )

const EMPTY: { option: Option; bid: Quote; ask: Quote }[] = []

export default function useQuoteBoard(
  board: Board,
  size: BigNumber,
  isCall: boolean
): { option: Option; bid: Quote; ask: Quote }[] {
  const [quotes] = useOptimismBlockFetch('QuoteBoard', [board.market().name, board.id, size], fetcher)
  return useMemo(() => (quotes ?? EMPTY).filter(q => q.option.isCall === isCall), [isCall, quotes])
}
