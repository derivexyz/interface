import { Network } from '@lyrafinance/lyra-js'

export default function getPageHeartbeat(network: Network) {
  switch (network) {
    case Network.Arbitrum:
      return 10 * 1000 // 10 seconds
    case Network.Optimism:
      return 30 * 1000 // 30 seconds
  }
}
