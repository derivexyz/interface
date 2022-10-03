import { LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY } from '../constants/localStorage'
import { OptimismChainId } from '../constants/networks'
import isServer from './isServer'

// HACK: Triggers page refresh to read new data
// This circumvents needing to pass chain ID to each hook
export default function setOptimismChainId(chainId: OptimismChainId): void {
  if (isServer()) {
    console.warn('Unable set chain ID server-side')
    return
  }
  localStorage.setItem(LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY, chainId.toString())
  window.location.reload()
}
