import { Network } from '../constants/networks'
import getNetworkConfig from './getNetworkConfig'

export const getChainIdForNetwork = (network: Network) => {
  return getNetworkConfig(network).chainId
}
