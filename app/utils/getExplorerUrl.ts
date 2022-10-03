import { ChainId } from '../constants/networks'
import getNetworkConfig from './getNetworkConfig'

export default function getExplorerUrl(chainId: ChainId, transactionHashOrAddress: string): string {
  const networkConfig = getNetworkConfig(chainId)
  const explorerUrl = networkConfig.blockExplorerUrl
  const type = transactionHashOrAddress.length > 42 ? 'tx' : 'address'
  return `${explorerUrl}/${type}/${transactionHashOrAddress}`
}
