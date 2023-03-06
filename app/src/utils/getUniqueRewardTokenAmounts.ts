import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

export default function getUniqueRewardTokenAmounts(rewardTokenAmount: RewardEpochTokenAmount[]) {
  return Object.values(
    rewardTokenAmount.reduce((map, rewardTokenAmount) => {
      if (!map[rewardTokenAmount.address]) {
        map[rewardTokenAmount.address] = { ...rewardTokenAmount }
        return map
      }
      map[rewardTokenAmount.address].amount += rewardTokenAmount.amount
      return map
    }, {} as Record<string, RewardEpochTokenAmount>)
  )
}
