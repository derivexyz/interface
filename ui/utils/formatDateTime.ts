import { BigNumber } from '@ethersproject/bignumber'
import dateFormat from 'dateformat'

import parseDate from './parseDate'

export default function formatDateTime(
  ts: number | BigNumber | Date,
  hideYear: boolean = false,
  hideMins: boolean = true
): string {
  return dateFormat(parseDate(ts), `mmm d, ${!hideYear ? 'yyyy, ' : ''}h${hideMins ? '' : ':MM'}TT`)
}
