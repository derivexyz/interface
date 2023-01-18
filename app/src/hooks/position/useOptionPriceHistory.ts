import { Network, Option } from '@lyrafinance/lyra-js'

import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodTimestamp from '@/app/utils/getChartPeriodTimestamp'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'

export type OptionPriceAndGreeksSnapshot = {
  timestamp: number
  optionPrice: string
}

export type OptionPriceSnapshot = {
  x: number
  optionPrice: number
}

const fetcher = async (
  network: Network,
  marketAddress: string,
  strikeId: number,
  isCall: boolean,
  period: ChartPeriod
): Promise<OptionPriceSnapshot[]> => {
  const option = await getLyraSDK(network).option(marketAddress, strikeId, isCall)
  const endTimestamp = Math.min(option.block.timestamp, option.board().expiryTimestamp)
  const startTimestamp = Math.max(endTimestamp - getChartPeriodTimestamp(period), 0)
  const optionPriceSnapshots = await option.priceHistory({
    startTimestamp,
    endTimestamp,
  })
  return optionPriceSnapshots.map(snapshot => ({
    x: snapshot.timestamp,
    optionPrice: fromBigNumber(snapshot.optionPrice),
  }))
}

const EMPTY: OptionPriceSnapshot[] = []

const useOptionPriceHistory = (option: Option, period: ChartPeriod): OptionPriceSnapshot[] => {
  const [history] = useFetch(
    'OptionPriceHistory',
    [option.lyra.network, option.market().address, option.strike().id, option.isCall, period],
    fetcher
  )
  return history ?? EMPTY
}

export default useOptionPriceHistory
