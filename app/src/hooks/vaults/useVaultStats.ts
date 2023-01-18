import Lyra, {
  Market,
  MarketLiquiditySnapshot,
  MarketNetGreeksSnapshot,
  MarketTradingVolumeSnapshot,
} from '@lyrafinance/lyra-js'

import { ZERO_BN } from '@/app/constants/bn'
import { SECONDS_IN_YEAR } from '@/app/constants/time'
import fromBigNumber from '@/app/utils/fromBigNumber'

import { useLyraFetch } from '../data/useLyraFetch'

export type VaultStats = {
  market: Market
  liquidity: MarketLiquiditySnapshot
  netGreeks: MarketNetGreeksSnapshot
  tradingVolume: MarketTradingVolumeSnapshot
  liquidityHistory: MarketLiquiditySnapshot[]
  netGreeksHistory: MarketNetGreeksSnapshot[]
  tradingVolumeHistory: MarketTradingVolumeSnapshot[]
  tvl: number
  tvlChange: number
  tokenPrice: number
  tokenPriceChange: number
  tokenPriceChangeAnnualized: number
  totalNotionalVolume: number
  totalNotionalVolumeChange: number
  totalFees: number
  openInterest: number
}

export const fetchVault = async (lyra: Lyra, marketAddress: string, period: number): Promise<VaultStats> => {
  const market = await lyra.market(marketAddress)
  const [tradingVolumeHistory, liquidityHistory, netGreeksHistory] = await Promise.all([
    market.tradingVolumeHistory({ startTimestamp: market.block.timestamp - period }),
    market.liquidityHistory({ startTimestamp: market.block.timestamp - period }),
    market.netGreeksHistory({ startTimestamp: market.block.timestamp - period }),
  ])

  const liquidity = liquidityHistory[liquidityHistory.length - 1]
  const netGreeks = netGreeksHistory[netGreeksHistory.length - 1]
  const tradingVolume = tradingVolumeHistory[tradingVolumeHistory.length - 1]

  const tvl = fromBigNumber(liquidity.tvl)
  const tvlOld = fromBigNumber(liquidityHistory[0].tvl)
  const tvlChange = tvlOld > 0 ? (tvl - tvlOld) / tvlOld : 0

  const tokenPrice = fromBigNumber(liquidity.tokenPrice)
  const tokenPriceOld = fromBigNumber(liquidityHistory[0].tokenPrice)
  const tokenPriceChange = tokenPriceOld > 0 ? (tokenPrice - tokenPriceOld) / tokenPriceOld : 0
  const tokenPriceChangeAnnualized = tokenPriceChange / (period / SECONDS_IN_YEAR)

  const totalNotionalVolumeNew = fromBigNumber(tradingVolume.totalNotionalVolume)
  const totalNotionalVolumeOld = fromBigNumber(tradingVolumeHistory[0].totalNotionalVolume)
  const totalNotionalVolume = totalNotionalVolumeNew - totalNotionalVolumeOld
  const totalNotionalVolumeChange =
    totalNotionalVolumeOld > 0 ? (totalNotionalVolumeNew - totalNotionalVolumeOld) / totalNotionalVolumeOld : 0

  const totalFees = fromBigNumber(tradingVolumeHistory.reduce((sum, { vaultFees }) => sum.add(vaultFees), ZERO_BN))

  const openInterest = fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice)

  return {
    market,
    liquidity,
    netGreeks,
    tradingVolume,
    liquidityHistory,
    netGreeksHistory,
    tradingVolumeHistory,
    tvl,
    tvlChange,
    tokenPrice,
    tokenPriceChange,
    tokenPriceChangeAnnualized,
    totalNotionalVolume,
    totalNotionalVolumeChange,
    totalFees,
    openInterest,
  }
}

export default function useVaultStats(market: Market, period: number): VaultStats | null {
  const [vaultStats] = useLyraFetch('VaultStats', market.lyra, [market.address, period], fetchVault)
  return vaultStats
}
