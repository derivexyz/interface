import getExplorerUrl from './getExplorerUrl'
import getOptimismChainId from './getOptimismChainId'

export default function getOptimismExplorerUrl(transactionHashOrAddress: string): string {
  return getExplorerUrl(getOptimismChainId(), transactionHashOrAddress)
}
