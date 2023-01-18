import { LOCAL_STORAGE_IS_TESTNET_KEY } from '../constants/localStorage'

// HACK: Triggers page refresh to read new data
// This circumvents needing to pass chain ID to each hook
export default function setIsMainnet(isMainnet: boolean): void {
  localStorage.setItem(LOCAL_STORAGE_IS_TESTNET_KEY, (!isMainnet).toString())
  window.location.reload()
}
