import { LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY } from '../constants/localStorage'

// HACK: Triggers page refresh to read new data
// This circumvents needing to pass chain ID to each hook
// TODO Update to be a boolean isTestnet flag
export default function setOptimismChainId(chainId: number): void {
  localStorage.setItem(LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY, chainId.toString())
  window.location.reload()
}
