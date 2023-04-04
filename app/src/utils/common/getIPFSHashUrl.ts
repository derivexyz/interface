import { CLOUDFLARE_URL } from '@/app/constants/links'

export default function getIPFSHashUrl(ipfsHash: string) {
  return `${CLOUDFLARE_URL}/ipfs/${ipfsHash}`
}
