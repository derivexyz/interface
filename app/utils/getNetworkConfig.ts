import nullthrows from 'nullthrows'

import { ChainId, NETWORK_CONFIGS, NetworkConfig } from '../constants/networks'

// TODO: Support Ethereum network
export default function getNetworkConfig(chainId: ChainId): NetworkConfig {
  const networkConfig = NETWORK_CONFIGS[chainId]
  return nullthrows(networkConfig, `No network config for chain id: ${chainId}`)
}
