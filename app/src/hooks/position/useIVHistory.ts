import { Network, Strike, StrikeIVHistory } from '@lyrafinance/lyra-js'

import { ChartPeriod } from '@/app/constants/chart'
import { FetchId } from '@/app/constants/fetch'
import getChartPeriodTimestamp from '@/app/utils/getChartPeriodTimestamp'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'

const fetcher = async (
  network: Network,
  marketAddress: string,
  boardId: number,
  strikeId: number,
  period: ChartPeriod
): Promise<StrikeIVHistory[]> => {
  const lyra = getLyraSDK(network)
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
  const [history] = useFetch(
    FetchId.PositionIVHistory,
    [strike.lyra.network, strike.market().address, strike.board().id, strike.id, period],
    fetcher
  )
  return history ?? EMPTY
}

export default useIVHistory
