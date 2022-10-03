import formatDuration from './formatDuration'

export default function formatDateDuration(start: Date, end: Date, showSeconds: boolean = false): string {
  const duration = Math.max(0, (end.getTime() - start.getTime()) / 1000) // seconds
  return formatDuration(duration, showSeconds)
}
