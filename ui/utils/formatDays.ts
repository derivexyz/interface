export default function formatDays(duration: number): string {
  const days = Math.round(duration / 86400)
  return `${days}d`
}
