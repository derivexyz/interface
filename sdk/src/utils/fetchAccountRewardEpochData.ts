import { LYRA_API_URL } from '../constants/links'
import Lyra, { Deployment } from '../lyra'
import fetchWithCache from './fetchWithCache'

export type AccountRewardEpochData = {
  account: string //indexed,
  deployment: string // indexed
  startTimestamp: number // indexed
  endTimestamp: number
  stkLyraDays: number
  inflationaryRewards: {
    lyra: number
    op: number
    isIgnored: boolean
  }
  lpDays: Record<string, number> // base
  boostedLpDays: Record<string, number> // boosted
  MMVRewards: Record<
    string,
    {
      isIgnored: boolean
      lyra: number
      op: number
    }
  >
  tradingRewards: {
    effectiveRebateRate: number
    lyraRebate: number
    opRebate: number
    tradingFees: number
    totalCollatRebateDollars: number
  }
  wethLyraStakingRewards?: {
    opRewards: number
    gUniTokensStaked: number
    percentShare: number
  }
}

export default async function fetchGlobalRewardEpochData(
  lyra: Lyra,
  account: string
): Promise<AccountRewardEpochData[]> {
  if (lyra.deployment !== Deployment.Mainnet) {
    return []
  }
  return fetchWithCache(`${LYRA_API_URL}/globalRewards?network=${lyra.network}&account=${account}`)
}
