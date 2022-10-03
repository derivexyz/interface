export default function formatShortDuration(delta: number): string {
  if (delta >= 86400) {
    const days = Math.floor(delta / 86400)
    return days + 'd'
  } else if (delta >= 3600) {
    const hours = Math.floor(delta / 3600) % 24
    return hours + 'h'
  } else if (delta >= 60) {
    const minutes = Math.floor(delta / 60) % 60
    return minutes + ' min' + (minutes === 1 ? '' : 's')
  } else {
    const seconds = Math.floor(delta)
    return seconds + 's'
  }
}
