import { BigNumber } from '@ethersproject/bignumber'
import dateFormat from 'dateformat'

import parseDate from './parseDate'

export type FormatDateTimeOptions = {
  hideYear?: boolean
  hideMins?: boolean
  includeTimezone?: boolean
}

export default function formatDateTime(ts: number | BigNumber | Date, options?: FormatDateTimeOptions): string {
  const { hideYear = false, hideMins = true, includeTimezone = false } = options ?? {}

  return dateFormat(
    parseDate(ts),
    `mmm d, ${!hideYear ? 'yyyy, ' : ''}h${hideMins ? '' : ':MM'}TT ${includeTimezone ? 'Z' : ''}`
  )
}
