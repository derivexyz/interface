import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

// TODO - @dillon think of better solution later
export const findLyraRewardEpochToken = (tokens: RewardEpochTokenAmount[]): number =>
  tokens?.find(token => ['lyra', 'stklyra'].includes(token.symbol.toLowerCase()))?.amount ?? 0
export const findOpRewardEpochToken = (tokens: RewardEpochTokenAmount[]): number =>
  tokens?.find(token => ['op'].includes(token.symbol.toLowerCase()))?.amount ?? 0
