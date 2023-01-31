import { Network, Option } from '@lyrafinance/lyra-js'

import { ChartInterval } from '@/app/constants/chart'
import { FetchId } from '@/app/constants/fetch'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getChartIntervalSeconds from '@/app/utils/getChartIntervalSeconds'
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
  interval: ChartInterval
): Promise<OptionPriceSnapshot[]> => {
  const option = await getLyraSDK(network).option(marketAddress, strikeId, isCall)
  const endTimestamp = Math.min(option.block.timestamp, option.board().expiryTimestamp)
  const startTimestamp = Math.max(endTimestamp - getChartIntervalSeconds(interval), 0)
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

const useOptionPriceHistory = (option: Option, interval: ChartInterval): OptionPriceSnapshot[] => {
  const [history] = useFetch(
    FetchId.PositionPriceHistory,
    [option.lyra.network, option.market().address, option.strike().id, option.isCall, interval],
    fetcher
  )
  return history ?? EMPTY
}

export default useOptionPriceHistory
