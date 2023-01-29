import { BigNumber } from '@ethersproject/bignumber'

import fromWei from './fromWei'

export type FormatNumberOptions = {
  dps?: number
  minDps?: number
  maxDps?: number
  precision?: number
  showSign?: boolean
  showCommas?: boolean
}

// default to 0.1% precision
const DEFAULT_PRECISION = 0.001

const round = (val: number, dps: number) => {
  const mul = Math.pow(10, dps)
  return Math.round(val * mul) / mul
}

export default function formatNumber(value: number | BigNumber, options?: FormatNumberOptions): string {
  const {
    dps,
    minDps: _minDps = 0,
    maxDps: _maxDps = 6,
    precision = DEFAULT_PRECISION,
    showSign = false,
    showCommas = true,
  } = options ?? {}

  const minDps = dps !== undefined ? dps : _minDps
  const maxDps = dps !== undefined ? dps : _maxDps

  // resolve value as number
  let val = 0
  if (BigNumber.isBigNumber(value)) {
    val = fromWei(value)
  } else {
    val = value
  }

  if (isNaN(val)) {
    return 'NaN'
  }

  let numDps = minDps
  let currRoundedVal: number = round(val, numDps)
  for (; numDps <= maxDps; numDps++) {
    currRoundedVal = round(val, numDps)
    const currPrecision = Math.abs((val - currRoundedVal) / val)
    if (currPrecision <= precision) {
      // escape dp increment when we hit desired precision
      break
    }
  }
  const roundedVal = currRoundedVal

  // convert into styled string
  // commas for number part e.g. 1,000,000
  // padded zeroes for dp precision e.g. 0.1000
  const parts = roundedVal.toString().split('.')
  const num = showCommas ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : parts[0] // add commas
  const dec = (parts[1] || '').padEnd(minDps, '0')
  const numStr = dec != null && dec.length > 0 ? num + '.' + dec : num
  return roundedVal > 0 && showSign ? '+' + numStr : numStr
}
