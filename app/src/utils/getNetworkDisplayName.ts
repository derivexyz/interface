import { Network } from '@lyrafinance/lyra-js'

export default function getNetworkDisplayName(network: Network | 'ethereum') {
  if (network === 'ethereum') {
    return 'Ethereum'
  }
  switch (network) {
    case Network.Arbitrum:
      return 'Arbitrum'
    case Network.Optimism:
      return 'Optimism'
  }
}
