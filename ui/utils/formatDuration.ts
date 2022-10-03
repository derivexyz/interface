export default function formatDuration(delta: number, showSeconds: boolean = false, showHours: boolean = true): string {
  const days = Math.floor(delta / 86400)
  delta -= days * 86400
  const hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600
  const minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60
  const seconds = Math.floor(delta)
  const daysStr = days > 0 ? days + 'd' : ''
  const hoursStr = showHours ? (hours > 0 ? hours + 'h' : '0h') : ''
  const minsStr = minutes > 0 ? minutes + 'm' : '0m'
  const secsStr = showSeconds ? (seconds > 0 ? seconds + 's' : '0s') : ''
  return `${daysStr} ${hoursStr} ${minsStr} ${secsStr}`.trim()
}
