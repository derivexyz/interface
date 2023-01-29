import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

import formatTokenName from './formatTokenName'

type FormatAPYOptions = {
  showSymbol?: boolean
  showEmptyDash?: boolean
}

export default function formatAPY(apys: RewardEpochTokenAmount[], options?: FormatAPYOptions) {
  const totalApy = apys.reduce((total, token) => total + token.amount, 0)

  if (apys.length === 0 || totalApy === 0) {
    return options?.showEmptyDash ? '-' : ''
  }

  const showSymbol = options?.showSymbol ?? true

  if (!showSymbol) {
    return formatPercentage(totalApy, true)
  }

  return `${formatPercentage(totalApy, true)} ${apys
    .filter(({ amount }) => amount > 0)
    .map(token => formatTokenName(token))
    .join(', ')}`
}
