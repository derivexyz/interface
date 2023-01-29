import formatNumber from './formatNumber'

export default function formatPercentage(pct: number, hidePlus: boolean = false): string {
  return `${pct > 0 ? (hidePlus ? '' : '+') : ''}${formatNumber(pct * 100, { showCommas: false })}%`
}
