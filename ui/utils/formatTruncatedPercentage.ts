import formatTruncatedNumber from './formatTruncatedNumber'

export default function formatTruncatedPercentage(pct: number, hidePlus: boolean = false): string {
  return `${pct > 0 ? (hidePlus ? '' : '+') : ''}${formatTruncatedNumber(pct * 100)}%`
}
