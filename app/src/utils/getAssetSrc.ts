import getHostname from './getHostname'

export default function getAssetSrc(path: string, includeHost: boolean = false): string {
  const hostname = getHostname()
  if (path.startsWith('http') && !path.startsWith(hostname)) {
    // External hostname
    return path
  } else {
    // Internal hostname
    const pathWithPrefixSlash = path.startsWith('/') ? path : '/' + path
    if (process.env.REACT_APP_IPFS === 'true' && pathWithPrefixSlash.startsWith('/images')) {
      // Point images to githubusercontent, reduce IPFS object size
      return `https://raw.githubusercontent.com/lyra-finance/interface/master/app/public${pathWithPrefixSlash}`
    } else if (includeHost) {
      return path.startsWith(hostname) ? path : `${hostname}${pathWithPrefixSlash}`
    } else {
      return pathWithPrefixSlash
    }
  }
}
