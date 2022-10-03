export default function formatTruncatedDuration(delta: number): string {
  const days = Math.floor(delta / 86400)
  delta -= days * 86400
  const hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600
  const minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60
  const seconds = Math.floor(delta)
  if (days > 0) {
    return days + 'd'
  }
  if (hours > 0) {
    return hours + 'h'
  }
  if (minutes > 0) {
    return minutes + 'm'
  }
  if (seconds) {
    return seconds + 's'
  }
  return '0s'
}
