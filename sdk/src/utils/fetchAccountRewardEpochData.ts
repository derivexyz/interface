import { LYRA_API_URL } from '../constants/links'
import Lyra, { Deployment } from '../lyra'

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

export default async function fetchAccountRewardEpochData(
  lyra: Lyra,
  account: string,
  blockTimestamp: number
): Promise<AccountRewardEpochData[]> {
  if (lyra.deployment !== Deployment.Mainnet) {
    throw new Error('GlobalRewardEpoch only supported on mainnet')
  }
  const res = await fetch(
    `${LYRA_API_URL}/globalRewards?account=${account}&blockTimestamp=${blockTimestamp}&network=${lyra.network}`,
    {
      method: 'GET',
    }
  )
  return await res.json()
}
