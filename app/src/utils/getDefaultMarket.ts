import { Network } from '@lyrafinance/lyra-js'

export const getDefaultMarket = (network: Network) => {
  switch (network) {
    case Network.Arbitrum:
    case Network.Optimism:
      return 'eth-usdc'
  }
}
