import { AppChain, AppNetwork, Network, NETWORK_CONFIGS, NetworkConfig } from '../constants/networks'
import isMainnet from './isMainnet'
import resolveNetwork from './resolveNetwork'

const getChainForNetwork = (network: AppNetwork): AppChain => {
  if (isMainnet()) {
    switch (network) {
      case AppNetwork.Arbitrum:
        return AppChain.Arbitrum
      case AppNetwork.Optimism:
        return AppChain.Optimism
      case AppNetwork.Ethereum:
        return AppChain.Ethereum
    }
  } else {
    switch (network) {
      case AppNetwork.Arbitrum:
        return AppChain.ArbitrumGoerli
      case AppNetwork.Optimism:
        return AppChain.OptimismGoerli
      case AppNetwork.Ethereum:
        return AppChain.EthereumGoerli
    }
  }
}

export default function getNetworkConfig(network: Network): NetworkConfig {
  return NETWORK_CONFIGS[getChainForNetwork(resolveNetwork(network))]
}
