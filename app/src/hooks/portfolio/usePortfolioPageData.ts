import { Market, Network, Position, SnapshotPeriod } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import { SECONDS_IN_DAY, SECONDS_IN_MONTH } from '@/app/constants/time'
import fetchMarkets from '@/app/utils/fetchMarkets'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getPageHeartbeat from '@/app/utils/getPageHeartbeat'

import useNetwork from '../account/useNetwork'
import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

export type PortfolioPageData = {
  marketData: PortfolioMarketData[]
  openPositions: Position[]
  portfolioOverview: PortfolioOverview
}

export type PortfolioMarketData = {
  market: Market
  spotPrice: number
  spotPrice24HChange: number
  totalNotionalVolume30D: number
  totalFees30D: number
  openInterest: number
  tvl: number
}

export type PortfolioOverview = {
  unrealizedPnl: number
  netDelta: number
  netVega: number
  lockedCollateral: number
}

const EMPTY: PortfolioPageData = {
  marketData: [],
  openPositions: [],
  portfolioOverview: {
    lockedCollateral: 0,
    unrealizedPnl: 0,
    netDelta: 0,
    netVega: 0,
  },
}

const fetcher = async (network: Network, owner: string | null): Promise<PortfolioPageData> => {
  const maybeFetchPositions = async (): Promise<Position[]> => (owner ? getLyraSDK(network).openPositions(owner) : [])

  const [allMarkets, openPositions] = await Promise.all([fetchMarkets([network]), maybeFetchPositions()])

  const markets = allMarkets.filter(market => market.liveBoards().length > 0)

  if (!markets.length) {
    return EMPTY
  }

  const timestamp = markets[0].block.timestamp

  const histories = await Promise.all(
    markets.map(async market =>
      Promise.all([
        market.spotPriceHistory({ startTimestamp: timestamp - SECONDS_IN_DAY, period: SnapshotPeriod.EightHours }),
        market.tradingVolumeHistory({ startTimestamp: timestamp - SECONDS_IN_MONTH, period: SnapshotPeriod.OneDay }),
        market.liquidity(),
      ])
    )
  )
  const openPositionStrikes = await Promise.all(openPositions.map(position => position.strike()))
  const unrealizedPnl = openPositions.reduce((unrealisedPnl, openPosition) => {
    return unrealisedPnl.add(openPosition.pnl().unrealizedPnl)
  }, ZERO_BN)
  const netDelta = openPositions.reduce((netDelta, openPosition) => {
    return netDelta.add(openPosition.delta)
  }, ZERO_BN)
  const netVega = openPositionStrikes.reduce((netVega, strike) => netVega.add(strike.vega), ZERO_BN)
  const lockedCollateral = openPositions.reduce(
    (lockedCollateral, openPosition) =>
      openPosition.collateral ? lockedCollateral.add(openPosition.collateral?.value) : lockedCollateral,
    ZERO_BN
  )

  return {
    marketData: histories.map(([spotPriceHistory, tradingVolumeHistory, liquidity], idx) => {
      const market = markets[idx]
      const spotPrice = fromBigNumber(market.spotPrice)
      const spotPrice24HAgo = spotPriceHistory.length ? fromBigNumber(spotPriceHistory[0].close) : 0
      const spotPrice24HChange = spotPrice24HAgo ? (spotPrice - spotPrice24HAgo) / spotPrice24HAgo : 0
      const totalNotionalVolume = fromBigNumber(
        tradingVolumeHistory[tradingVolumeHistory.length - 1].totalNotionalVolume
      )
      const totalNotionalVolume30DAgo = fromBigNumber(tradingVolumeHistory[0].totalNotionalVolume)
      const totalNotionalVolume30D = totalNotionalVolume - totalNotionalVolume30DAgo
      const totalFees30D = tradingVolumeHistory.reduce((sum, p) => sum + fromBigNumber(p.vaultFees), 0)
      const openInterest = fromBigNumber(market.openInterest) * spotPrice
      const tvl = fromBigNumber(liquidity.tvl)
      return {
        market,
        spotPrice,
        spotPrice24HChange,
        totalNotionalVolume30D,
        totalFees30D,
        openInterest,
        tvl,
      }
    }),
    openPositions: openPositions.sort((a, b) => a.expiryTimestamp - b.expiryTimestamp),
    portfolioOverview: {
      unrealizedPnl: fromBigNumber(unrealizedPnl),
      netDelta: fromBigNumber(netDelta),
      netVega: fromBigNumber(netVega),
      lockedCollateral: fromBigNumber(lockedCollateral),
    },
  }
}

export default function usePortfolioPageData(): PortfolioPageData {
  const owner = useWalletAccount()
  const network = useNetwork()

  const [data] = useFetch(FetchId.PortfolioPageData, [network, owner], fetcher, {
    refreshInterval: getPageHeartbeat(network),
  })
  return data ?? EMPTY
}
