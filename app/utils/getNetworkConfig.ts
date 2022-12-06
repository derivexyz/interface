import { Chain } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import { NETWORK_CONFIGS, NetworkConfig } from '../constants/networks'

// TODO: Support Ethereum network
export default function getNetworkConfig(chain: Chain): NetworkConfig {
  const networkConfig = NETWORK_CONFIGS[chain]
  return nullthrows(networkConfig, `No network config for chain: ${chain}`)
}
