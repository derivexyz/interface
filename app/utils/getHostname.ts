import isServer from './isServer'

export default function getHostname(): string {
  return isServer()
    ? process.env.NEXT_PUBLIC_HOSTNAME ?? process.env.VERCEL_URL ?? ''
    : `${window.location.href.split('://')[0]}://${window.location.host}`
}
