import { Strike, StrikeIVHistory } from '@lyrafinance/lyra-js'
import Lyra from '@lyrafinance/lyra-js'

import { ChartPeriod } from '@/app/constants/chart'
import getChartPeriodTimestamp from '@/app/utils/getChartPeriodTimestamp'

import { useLyraFetch } from '../data/useLyraFetch'

const fetcher = async (
  lyra: Lyra,
  marketAddress: string,
  boardId: number,
  strikeId: number,
  period: ChartPeriod
): Promise<StrikeIVHistory[]> => {
  const board = await lyra.board(marketAddress, boardId)
  const strike = board.strike(strikeId)
  const endTimestamp = Math.min(board.block.timestamp, board.expiryTimestamp)
  const startTimestamp = Math.max(endTimestamp - getChartPeriodTimestamp(period), 0)
  return await strike.ivHistory(lyra, {
    startTimestamp,
    endTimestamp,
  })
}

const EMPTY: StrikeIVHistory[] = []

const useIVHistory = (strike: Strike, period: ChartPeriod): StrikeIVHistory[] => {
  const [history] = useLyraFetch(
    'StrikeIVHistory',
    strike.lyra,
    [strike.market().address, strike.board().id, strike.id, period],
    fetcher
  )
  return history ?? EMPTY
}

export default useIVHistory
