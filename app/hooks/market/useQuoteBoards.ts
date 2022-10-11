import lyra from '@lyra/app/utils/lyra'
import { Board, Option, Quote } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import useOptimismBlockFetch from '../data/useOptimismBlockFetch'

type BoardQuotes = {
  board: Board
  quotes: {
    bid: Quote
    ask: Quote
    option: Option
  }[]
}[]

const fetcher = async (marketAddressOrName: string, _size: BigNumber): Promise<BoardQuotes> => {
  const size = BigNumber.from(_size)
  const market = await lyra.market(marketAddressOrName)
  const boards = market.liveBoards()
  const boardQuotes = await Promise.all(
    boards.map(async board => ({ quotes: await lyra.quoteBoard(marketAddressOrName, board.id, size), board }))
  )
  return boardQuotes
}

const EMPTY: BoardQuotes = []

export default function useQuoteBoards(marketAddressOrName: string, size: BigNumber): BoardQuotes {
  const [quotes] = useOptimismBlockFetch('QuoteBoards', [marketAddressOrName, size], fetcher)
  return quotes ?? EMPTY
}
