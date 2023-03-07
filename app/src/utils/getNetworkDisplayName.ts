import { Network } from '../constants/networks'
import getNetworkConfig from './getNetworkConfig'

export default function getNetworkDisplayName(network: Network) {
  return getNetworkConfig(network).displayName
}
