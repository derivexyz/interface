import { BigNumber } from '@ethersproject/bignumber'
import { GlobalRewardEpoch, RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

import { UNIT } from '../constants/bn'
import { SECONDS_IN_DAY } from '../constants/time'
import fromBigNumber from './fromBigNumber'

type RewardTokenYield = RewardEpochTokenAmount & {
  yield: number
}

export default function getStakingYieldPerDay(
  totalStkLyraSupply: BigNumber,
  stkLyraBalance: BigNumber,
  globalRewardEpoch: GlobalRewardEpoch
): RewardTokenYield[] {
  const stakedLyraPctShare = totalStkLyraSupply.gt(0)
    ? fromBigNumber(stkLyraBalance.mul(UNIT).div(totalStkLyraSupply))
    : 0
  return globalRewardEpoch.totalStakingRewards.map(rewardToken => {
    // Token emission per day
    const totalTokensPerDay =
      globalRewardEpoch.duration > 0 ? (rewardToken.amount / globalRewardEpoch.duration) * SECONDS_IN_DAY : 0
    return {
      ...rewardToken,
      yield: totalTokensPerDay * stakedLyraPctShare,
    }
  })
}
