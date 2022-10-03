import { BigNumber } from '@ethersproject/bignumber'

import formatNumber, { FormatNumberOptions } from './formatNumber'

type FormatUSDOptions = FormatNumberOptions

export default function formatUSD(price: number | BigNumber, options?: FormatUSDOptions): string {
  if (typeof price === 'number' && isNaN(price)) {
    return ''
  }
  const numStr = formatNumber(price, { ...options, minDps: 2 })
  const isSigned = numStr.startsWith('-') || numStr.startsWith('+')
  if (isSigned) {
    return `${numStr.slice(0, 1)}$${numStr.slice(1)}`
  } else {
    return `$${numStr}`
  }
}
