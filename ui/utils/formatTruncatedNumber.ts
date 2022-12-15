import { BigNumber } from '@ethersproject/bignumber'

import formatNumber from './formatNumber'
import fromWei from './fromWei'

const BILLION = Math.pow(10, 9)
const MILLION = Math.pow(10, 6)
const THOUSAND = Math.pow(10, 3)

export default function formatTruncatedNumber(value: BigNumber | number) {
  let val = 0
  if (BigNumber.isBigNumber(value)) {
    val = fromWei(value)
  } else {
    val = value
  }
  // TODO: @dappbeast Add trillion case... one day 8)
  if (Math.abs(val) >= BILLION - Math.pow(10, 7)) {
    // billion
    return formatNumber(val / BILLION, { minDps: 0, maxDps: 2 }) + 'b'
  } else if (Math.abs(val) >= MILLION - Math.pow(10, 4)) {
    // million
    return formatNumber(val / MILLION, { minDps: 0, maxDps: 2 }) + 'm'
  } else if (Math.abs(val) >= THOUSAND - Math.pow(10, 1)) {
    // thousand
    return formatNumber(val / THOUSAND, { minDps: 0, maxDps: 2 }) + 'k'
  } else {
    // hundreds
    return formatNumber(val, { minDps: 0, maxDps: 2 })
  }
}
