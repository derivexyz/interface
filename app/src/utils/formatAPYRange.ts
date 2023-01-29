import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

import formatTokenName from './formatTokenName'

type FormatAPYRangeOptions = {
  showEmptyDash?: boolean
}

export default function formatAPYRange(
  minApys: RewardEpochTokenAmount[],
  maxApys: RewardEpochTokenAmount[],
  options?: FormatAPYRangeOptions
) {
  const minTotalApy = minApys.reduce((total, token) => total + token.amount, 0)
  const maxTotalApy = maxApys.reduce((total, token) => total + token.amount, 0)

  if (
    minApys.length === 0 ||
    maxApys.length === 0 ||
    minApys.length !== maxApys.length ||
    minTotalApy === 0 ||
    maxTotalApy === 0
  ) {
    return options?.showEmptyDash ? '-' : ''
  }

  return `${formatPercentage(minTotalApy, true)} - ${formatPercentage(maxTotalApy, true)} ${minApys
    .filter(({ amount }) => amount > 0)
    .map(token => formatTokenName(token))
    .join(', ')}`
}
