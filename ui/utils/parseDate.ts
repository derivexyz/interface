import { BigNumber } from '@ethersproject/bignumber'

const MIN_DATE_MS = 946684800000 // 1st Jan 2000

// accepts seconds or milliseconds
export default function parseDate(timestamp: number | BigNumber | Date): Date {
  let ts: number
  if (timestamp instanceof Date) {
    ts = timestamp.getTime()
  } else if (BigNumber.isBigNumber(timestamp)) {
    ts = timestamp.toNumber()
  } else {
    ts = timestamp
  }
  return new Date(ts < MIN_DATE_MS ? ts * 1000 : ts)
}
