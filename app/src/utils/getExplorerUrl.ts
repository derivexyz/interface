import { Network } from '../constants/networks'
import getNetworkConfig from './getNetworkConfig'

export default function getExplorerUrl(network: Network, transactionHashOrAddress: string): string {
  const networkConfig = getNetworkConfig(network)
  const explorerUrl = networkConfig.blockExplorerUrl
  const type = transactionHashOrAddress.length > 42 ? 'tx' : 'address'
  return `${explorerUrl}/${type}/${transactionHashOrAddress}`
}
