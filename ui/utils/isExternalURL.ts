export default function isExternalURL(url: string): boolean {
  // TODO: more granular check
  if (url.startsWith('http')) {
    return true
  } else {
    return false
  }
}
