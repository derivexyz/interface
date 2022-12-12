export default function getHostname(): string {
  return `${window.location.href.split('://')[0]}://${window.location.host}`
}
