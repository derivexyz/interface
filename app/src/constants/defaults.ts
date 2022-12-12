import { Network } from '@lyrafinance/lyra-js'

export const getDefaultMarket = (network: Network) => {
  switch (network) {
    case Network.Arbitrum:
      return 'wbtc-usdc'
    case Network.Optimism:
      return 'seth-susd'
  }
}
