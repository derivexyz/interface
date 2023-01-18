import { Network } from '@lyrafinance/lyra-js'

export default function getNetworkFromPath(path: string): Network | null {
  const parts = path
    .split('?')[0]
    .split('#')[0]
    .split('/')
    .filter(p => p !== '')
  const network = parts[1]

  // TODO: Replace logic with TabId
  if (network === Network.Arbitrum) {
    return Network.Arbitrum
  } else if (network === Network.Optimism) {
    return Network.Optimism
  }
  return null
}
