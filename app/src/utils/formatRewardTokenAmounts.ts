import formatNumber from '@lyra/ui/utils/formatNumber'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

const formatRewardTokenAmounts = (rewardTokenAmounts: RewardEpochTokenAmount[]) => {
  return rewardTokenAmounts
    .map(rewardTokenAmount => `${formatNumber(rewardTokenAmount.amount)} ${rewardTokenAmount.symbol}`)
    .join(', ')
}

export default formatRewardTokenAmounts
