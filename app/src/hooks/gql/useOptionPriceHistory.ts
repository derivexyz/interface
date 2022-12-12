import { ChartPeriod } from '@/app/constants/chart'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartPeriodStartTimestamp from '@/app/utils/getChartPeriodStartTimestamp'
import lyra from '@/app/utils/lyra'

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
  marketAddress: string,
  strikeId: number,
  isCall: boolean,
  period: ChartPeriod
): Promise<OptionPriceSnapshot[]> => {
  const option = await lyra.option(marketAddress, strikeId, isCall)
  const startTimestamp = getChartPeriodStartTimestamp(option.block.timestamp, period)
  const optionPriceSnapshots = await option.priceHistory({
    startTimestamp,
  })
  const optionPriceHistory = optionPriceSnapshots.map(snapshot => {
    return {
      x: snapshot.timestamp,
      optionPrice: fromBigNumber(snapshot.optionPrice),
    }
  })
  return optionPriceHistory
}

const EMPTY: OptionPriceSnapshot[] = []

const useOptionPriceHistory = (
  marketAddress: string | null,
  strikeId: number,
  isCall: boolean,
  period: ChartPeriod
): OptionPriceSnapshot[] => {
  const [history] = useFetch(
    'OptionPriceHistory',
    marketAddress ? [marketAddress, strikeId, isCall, period] : null,
    fetcher
  )
  return history ?? EMPTY
}

export default useOptionPriceHistory
