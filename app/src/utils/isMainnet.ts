import { LOCAL_STORAGE_IS_TESTNET_KEY } from '../constants/localStorage'

export default function isMainnet(): boolean {
  const isTestnetStr = localStorage.getItem(LOCAL_STORAGE_IS_TESTNET_KEY)
  if (isTestnetStr === null) {
    const isDefaultTestnet = process.env.REACT_APP_IS_DEFAULT_TESTNET === 'true'
    localStorage.setItem(LOCAL_STORAGE_IS_TESTNET_KEY, isDefaultTestnet ? 'true' : 'false')
    return !isDefaultTestnet
  } else {
    const isTestnet = isTestnetStr === 'true'
    return !isTestnet
  }
}
