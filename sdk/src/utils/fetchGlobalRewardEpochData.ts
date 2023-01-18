import fetch from 'cross-fetch'

import { LYRA_API_URL } from '../constants/links'
import Lyra, { Deployment } from '../lyra'

export type TradingRewardsConfig = {
  useRebateTable: boolean
  rebateRateTable: { cutoff: number; returnRate: number }[]
  maxRebatePercentage: number
  netVerticalStretch: number // param a // netVerticalStretch
  verticalShift: number // param b // verticalShift
  vertIntercept: number // param c // minReward // vertIntercept
  stretchiness: number // param d // stretchiness
  rewards: {
    lyraRewardsCap: number
    opRewardsCap: number
    floorTokenPriceOP: number
    floorTokenPriceLyra: number
    lyraPortion: number // % split of rebates in stkLyra vs OP (in dollar terms)
    fixedLyraPrice: number // override market rate after epoch is over, if 0 just use market rate
    fixedOpPrice: number
  }
  shortCollatRewards: {
    [market: string]: {
      tenDeltaRebatePerOptionDay: number
      ninetyDeltaRebatePerOptionDay: number
      longDatedPenalty: number
    }
  }
}

export type GlobalRewardEpochData = {
  deployment: string // indexed
  startTimestamp: number // indexed
  endTimestamp: number
  lastUpdated: number
  totalStkLyraDays: number
  scaledStkLyraDays: Record<string, number>
  stkLyraDaysPerLPMarket: Record<string, number>
  totalLpTokenDays: Record<string, number>
  totalBoostedLpTokenDays: Record<string, number>
  rewardedStakingRewards: {
    lyra: number
    op: number
  }
  rewardedMMVRewards: {
    LYRA: Record<string, number>
    OP: Record<string, number>
  }
  rewardedTradingRewards: Record<string, number>
  tradingRewardConfig: TradingRewardsConfig
  MMVConfig: Record<
    string,
    {
      LYRA: number
      OP: number
      x: number
      ignoreList: string[]
      totalStkScaleFactor: number
    }
  >
  stakingRewardConfig: {
    totalRewards: {
      LYRA: number
      OP: number
    }
  }
  wethLyraStakingRewardConfig?: {
    totalRewards: {
      OP: number
    }
  }
}

export default async function fetchGlobalRewardEpochData(
  lyra: Lyra,
  blockTimestamp: number
): Promise<GlobalRewardEpochData[]> {
  if (lyra.deployment !== Deployment.Mainnet) {
    throw new Error('GlobalRewardEpoch only supported on mainnet')
  }
  const res = await fetch(`${LYRA_API_URL}/globalRewards?blockTimestamp=${blockTimestamp}&network=${lyra.network}`, {
    method: 'GET',
  })
  return await res.json()
}
