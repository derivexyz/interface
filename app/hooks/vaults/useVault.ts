import { GlobalRewardEpoch, GlobalRewardEpochAPY, Market } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '@/app/constants/bn'
import { DAYS_IN_YEAR, SECONDS_IN_MONTH, SECONDS_IN_WEEK } from '@/app/constants/time'
import fromBigNumber from '@/app/utils/fromBigNumber'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

export type Vault = {
  market: Market
  globalRewardEpoch: GlobalRewardEpoch | null
  tvl: number
  tvlChange: number
  tradingVolume30D: number
  tokenPrice: number
  tokenPrice30DChange: number
  tokenPrice30DChangeAnnualized: number
  fees: number
  openInterest: number
  netDelta: number
  netStdVega: number
  minApy: number
  minLyraApy: number
  minOpApy: number
  maxApy: number
  maxLyraApy: number
  maxOpApy: number
  pendingDeposits: number
  utilization: number
}

const EMPTY_VAULT_APY: GlobalRewardEpochAPY = {
  total: 0,
  op: 0,
  lyra: 0,
}

export const fetchVault = async (marketAddressOrName: string): Promise<Vault> => {
  const market = await lyra.market(marketAddressOrName)
  const startTimestamp = market.block.timestamp - SECONDS_IN_MONTH
  const [tradingVolumeHistoryResult, liquidityHistoryResult, netGreeksResult, globalRewardEpochResult] =
    await Promise.allSettled([
      market.tradingVolumeHistory({ startTimestamp }),
      market.liquidityHistory({ startTimestamp }),
      market.netGreeks(),
      lyra.latestGlobalRewardEpoch(),
    ])

  const tradingVolumeHistory = tradingVolumeHistoryResult.status === 'fulfilled' ? tradingVolumeHistoryResult.value : []
  const liquidityHistory = liquidityHistoryResult.status === 'fulfilled' ? liquidityHistoryResult.value : []
  const netGreeks = netGreeksResult.status === 'fulfilled' ? netGreeksResult.value : null
  const globalRewardEpoch = globalRewardEpochResult.status === 'fulfilled' ? globalRewardEpochResult.value : null

  const {
    total: minApy,
    op: minOpApy,
    lyra: minLyraApy,
  } = globalRewardEpoch?.minVaultApy(marketAddressOrName) ?? EMPTY_VAULT_APY
  const {
    total: maxApy,
    op: maxOpApy,
    lyra: maxLyraApy,
  } = globalRewardEpoch?.maxVaultApy(marketAddressOrName) ?? EMPTY_VAULT_APY

  const totalNotionalVolume = tradingVolumeHistory.length
    ? tradingVolumeHistory[tradingVolumeHistory.length - 1].totalNotionalVolume
    : ZERO_BN
  const totalNotionalVolume30DAgo = tradingVolumeHistory.length ? tradingVolumeHistory[0].totalNotionalVolume : ZERO_BN
  const tradingVolume30D = fromBigNumber(totalNotionalVolume.sub(totalNotionalVolume30DAgo))
  const fees = tradingVolumeHistory.reduce(
    (sum, tradingVolume) =>
      sum
        .add(tradingVolume.deltaCutoffFees)
        .add(tradingVolume.lpLiquidationFees)
        .add(tradingVolume.optionPriceFees)
        .add(tradingVolume.spotPriceFees)
        .add(tradingVolume.vegaFees)
        .add(tradingVolume.varianceFees),
    ZERO_BN
  )
  const tvl = fromBigNumber(market.tvl)
  const tvl30D = liquidityHistory.length ? fromBigNumber(liquidityHistory[0].nav) : 0
  const tvlChange = tvl30D > 0 ? (tvl - tvl30D) / tvl30D : 0
  const tokenPrice30D = liquidityHistory.length ? fromBigNumber(liquidityHistory[0].tokenPrice) : 0
  const tokenPrice =
    liquidityHistory.length > 1 ? fromBigNumber(liquidityHistory[liquidityHistory.length - 1].tokenPrice) : 0
  const tokenPrice30DChange = tokenPrice30D > 0 ? (tokenPrice - tokenPrice30D) / tokenPrice30D : 0
  const tokenPrice30DChangeAnnualized = (tokenPrice30DChange / 30) * DAYS_IN_YEAR
  const pendingDeposits = liquidityHistory.length
    ? fromBigNumber(liquidityHistory[liquidityHistory.length - 1].pendingDeposits)
    : 0
  const utilization = market.liquidity.utilization

  const earliestStartTimestamp = tradingVolumeHistory.length ? tradingVolumeHistory[0].startTimestamp : startTimestamp
  const is14dOld = earliestStartTimestamp - startTimestamp < SECONDS_IN_WEEK

  return {
    market,
    globalRewardEpoch,
    tvl,
    tvlChange: is14dOld ? tvlChange : 0,
    tradingVolume30D: is14dOld ? tradingVolume30D : 0,
    tokenPrice,
    tokenPrice30DChange: is14dOld ? tokenPrice30DChange : 0,
    tokenPrice30DChangeAnnualized: is14dOld ? tokenPrice30DChangeAnnualized : 0,
    fees: fromBigNumber(fees),
    openInterest: fromBigNumber(market.openInterest),
    netDelta: fromBigNumber(netGreeks?.netDelta ?? ZERO_BN),
    netStdVega: fromBigNumber(netGreeks?.netStdVega ?? ZERO_BN),
    utilization,
    minApy,
    minLyraApy,
    minOpApy,
    maxApy,
    maxLyraApy,
    maxOpApy,
    pendingDeposits,
  }
}

export default function useVault(marketAddressOrName: string): Vault | null {
  const [poolStats] = useFetch('Vault', marketAddressOrName ? [marketAddressOrName] : null, fetchVault)
  return poolStats
}
