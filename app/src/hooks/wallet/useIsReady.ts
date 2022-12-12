import getOptimismChainId from '@/app/utils/getOptimismChainId'

import useWallet from './useWallet'

export default function useIsReady(): boolean {
  const { chainId, isConnected, isOverride } = useWallet()
  const isReady = isConnected && chainId === getOptimismChainId() && !isOverride
  return isReady
}
