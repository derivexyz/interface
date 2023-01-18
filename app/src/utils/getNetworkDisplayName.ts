import { Network } from '@lyrafinance/lyra-js'

export default function getNetworkDisplayName(network: Network) {
  switch (network) {
    case Network.Arbitrum:
      return 'Arbitrum'
    case Network.Optimism:
      return 'Optimism'
  }
}
