import { Chain, Network } from '@lyrafinance/lyra-js'

export default function getNetworkForChain(chain: Chain): Network {
  switch (chain) {
    case Chain.Arbitrum:
    case Chain.ArbitrumGoerli:
      return Network.Arbitrum
    case Chain.Optimism:
    case Chain.OptimismGoerli:
      return Network.Optimism
  }
}
