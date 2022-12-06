import { BigNumber } from '@ethersproject/bignumber'

import formatNumber from './formatNumber'
import fromWei from './fromWei'

const BILLION = Math.pow(10, 9) - Math.pow(10, 7)
const MILLION = Math.pow(10, 6) - Math.pow(10, 4)
const THOUSAND = Math.pow(10, 3) - Math.pow(10, 1)

export default function formatTruncatedNumber(value: BigNumber | number) {
  let val = 0
  if (BigNumber.isBigNumber(value)) {
    val = fromWei(value)
  } else {
    val = value
  }
  // TODO: @dappbeast Add trillion case... one day 8)
  if (Math.abs(val) >= BILLION) {
    // billion
    return formatNumber(val / BILLION, { minDps: 0, maxDps: 2 }) + 'b'
  } else if (Math.abs(val) >= MILLION) {
    // million
    return formatNumber(val / MILLION, { minDps: 0, maxDps: 2 }) + 'm'
  } else if (Math.abs(val) >= THOUSAND) {
    // thousand
    return formatNumber(val / THOUSAND, { minDps: 0, maxDps: 2 }) + 'k'
  } else {
    // hundreds
    return formatNumber(val, { minDps: 0, maxDps: 2 })
  }
}
