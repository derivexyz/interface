import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedPercentage from '@lyra/ui/utils/formatTruncatedPercentage'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

import formatTokenName from './formatTokenName'

type FormatAPYRangeOptions = {
  showEmptyDash?: boolean
  showSymbol?: boolean
  truncated?: boolean
}

export default function formatAPYRange(
  minApys: RewardEpochTokenAmount[],
  maxApys: RewardEpochTokenAmount[],
  options?: FormatAPYRangeOptions
) {
  const minTotalApy = minApys.reduce((total, token) => total + token.amount, 0)
  const maxTotalApy = maxApys.reduce((total, token) => total + token.amount, 0)
  const formatFn = options?.truncated ? formatTruncatedPercentage : formatPercentage
  if (
    minApys.length === 0 ||
    maxApys.length === 0 ||
    minApys.length !== maxApys.length ||
    minTotalApy === 0 ||
    maxTotalApy === 0
  ) {
    return options?.showEmptyDash ? '-' : ''
  }

  const showSymbol = options?.showSymbol ?? true

  if (!showSymbol) {
    return `${formatFn(minTotalApy, true)} - ${formatFn(maxTotalApy, true)}`
  }

  return `${formatFn(minTotalApy, true)} - ${formatFn(maxTotalApy, true)} ${minApys
    .filter(({ amount }) => amount > 0)
    .map(token => formatTokenName(token))
    .join(', ')}`
}
