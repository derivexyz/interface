import dateFormat from 'dateformat'

import parseDate from './parseDate'

export default function formatTime(ts: number): string {
  return dateFormat(parseDate(ts), 'hh:MM TT')
}
