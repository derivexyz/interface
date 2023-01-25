import { Network } from '@lyrafinance/lyra-js'

export default function getPageHeartbeat(network: Network) {
  switch (network) {
    case Network.Arbitrum:
      return 5 * 1000 // 5 seconds
    case Network.Optimism:
      return 15 * 1000 // 15 seconds
  }
}
