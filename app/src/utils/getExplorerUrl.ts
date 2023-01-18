import { Network } from '@lyrafinance/lyra-js'

import getChainForChainId from './getChainForChainId'
import { getChainIdForNetwork } from './getChainIdForNetwork'
import getNetworkConfig from './getNetworkConfig'
import { MAINNET_NETWORK_CONFIG } from './mainnetProvider'

export default function getExplorerUrl(network: Network | 'ethereum', transactionHashOrAddress: string): string {
  const networkConfig =
    network === 'ethereum'
      ? MAINNET_NETWORK_CONFIG
      : getNetworkConfig(getChainForChainId(getChainIdForNetwork(network)))
  const explorerUrl = networkConfig.blockExplorerUrl
  const type = transactionHashOrAddress.length > 42 ? 'tx' : 'address'
  return `${explorerUrl}/${type}/${transactionHashOrAddress}`
}
