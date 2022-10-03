import { Strike, StrikeIVHistory } from '@lyrafinance/lyra-js'

import { ChartPeriod } from '@/app/constants/chart'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetcher = async (
  marketAddress: string,
  boardId: number,
  strikeId: number,
  period: ChartPeriod
): Promise<StrikeIVHistory[]> => {
  const board = await lyra.board(marketAddress, boardId)
  const strike = board.strike(strikeId)
  const startTimestamp = getChartPeriodStartTimestamp(strike.block.timestamp, period)
  return await strike.ivHistory(lyra, {
    startTimestamp,
  })
}

const EMPTY: StrikeIVHistory[] = []

const useIVHistory = (strike: Strike, period: ChartPeriod): StrikeIVHistory[] => {
  const [history] = useFetch(
    'StrikeIVHistory',
    [strike.market().address, strike.board().id, strike.id, period],
    fetcher
  )
  return history ?? EMPTY
}

export default useIVHistory
