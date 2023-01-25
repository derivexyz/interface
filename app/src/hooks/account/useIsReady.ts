import useWallet from './useWallet'

export default function useIsReady(targetChainId: number): boolean {
  const { chainId, isConnected, isOverride } = useWallet()
  const isReady = isConnected && !!chainId && targetChainId === chainId && !isOverride
  return isReady
}
