import getChainForChainId from './getChainForChainId'
import getNetworkConfig from './getNetworkConfig'

export default function getExplorerUrl(chainId: number, transactionHashOrAddress: string): string {
  const chain = getChainForChainId(chainId)
  const networkConfig = getNetworkConfig(chain)
  const explorerUrl = networkConfig.blockExplorerUrl
  const type = transactionHashOrAddress.length > 42 ? 'tx' : 'address'
  return `${explorerUrl}/${type}/${transactionHashOrAddress}`
}
