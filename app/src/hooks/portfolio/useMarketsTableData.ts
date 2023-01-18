import { Market, SnapshotPeriod } from '@lyrafinance/lyra-js'

import { SECONDS_IN_DAY, SECONDS_IN_MONTH } from '@/app/constants/time'
import fromBigNumber from '@/app/utils/fromBigNumber'

import useFetch from '../data/useFetch'
import { fetchMarkets } from '../market/useMarkets'

export type MarketTableData = {
  market: Market
  spotPrice: number
  spotPrice24HChange: number
  totalNotionalVolume30D: number
  totalFees30D: number
  openInterest: number
}

const fetcher = async (): Promise<MarketTableData[]> => {
  const markets = (await fetchMarkets()).filter(market => market.liveBoards().length > 0)

  if (!markets.length) {
    return []
  }

  const timestamp = markets[0].block.timestamp

  // TODO: @dappbeast Replace with SDK spot price feed
  const histories = await Promise.all(
    markets.map(async market =>
      Promise.all([
        market.spotPriceHistory({ startTimestamp: timestamp - SECONDS_IN_DAY, period: SnapshotPeriod.EightHours }),
        market.tradingVolumeHistory({ startTimestamp: timestamp - SECONDS_IN_MONTH, period: SnapshotPeriod.OneDay }),
      ])
    )
  )

  return histories.map(([spotPriceHistory, tradingVolumeHistory], idx) => {
    const market = markets[idx]
    const spotPrice = fromBigNumber(market.spotPrice)
    const spotPrice24HAgo = spotPriceHistory.length ? fromBigNumber(spotPriceHistory[0].close) : 0
    const spotPrice24HChange = spotPrice24HAgo ? (spotPrice - spotPrice24HAgo) / spotPrice24HAgo : 0
    const totalNotionalVolume = fromBigNumber(tradingVolumeHistory[tradingVolumeHistory.length - 1].totalNotionalVolume)
    const totalNotionalVolume30DAgo = fromBigNumber(tradingVolumeHistory[0].totalNotionalVolume)
    const totalNotionalVolume30D = totalNotionalVolume - totalNotionalVolume30DAgo
    const totalFees30D = tradingVolumeHistory.reduce((sum, p) => sum + fromBigNumber(p.vaultFees), 0)
    const openInterest = fromBigNumber(market.openInterest) * spotPrice
    return {
      market,
      spotPrice,
      spotPrice24HChange,
      totalNotionalVolume30D,
      totalFees30D,
      openInterest,
    }
  })
}

const EMPTY: MarketTableData[] = []

export default function useMarketsTableData(): MarketTableData[] {
  const [marketsTableData] = useFetch('MarketsTableData', [], fetcher)
  return marketsTableData ?? EMPTY
}
