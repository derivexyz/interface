import dateFormat from 'dateformat'

import parseDate from './parseDate'

export default function formatDateHour(ts: number): string {
  return dateFormat(parseDate(ts), 'mmm dS, hTT')
}
