import { BigNumber } from '@ethersproject/bignumber'

import formatTruncatedNumber from './formatTruncatedNumber'
import fromWei from './fromWei'

type FormatUSDOptions = {
  showSign?: boolean
}

export default function formatTruncatedUSD(price: number | BigNumber, options?: FormatUSDOptions) {
  const signStr = price < 0 ? '-' : price >= 0 && options?.showSign ? '+' : ''
  const val = BigNumber.isBigNumber(price) ? fromWei(price) : price
  const absVal = Math.abs(val)
  return signStr + '$' + formatTruncatedNumber(absVal)
}
