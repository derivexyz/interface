import { LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY } from '../constants/localStorage'
import isServer from './isServer'

// HACK: Triggers page refresh to read new data
// This circumvents needing to pass chain ID to each hook
// TODO Update to be a boolean isTestnet flag
export default function setOptimismChainId(chainId: number): void {
  if (isServer()) {
    console.warn('Unable set chain ID server-side')
    return
  }
  localStorage.setItem(LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY, chainId.toString())
  window.location.reload()
}
