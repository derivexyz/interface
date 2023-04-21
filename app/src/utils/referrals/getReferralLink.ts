export default function getReferralLink(referrerCode: string) {
  return `https://${window.location.host}?ref=${referrerCode}`
}
