import { Network } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import { LOCAL_STORAGE_DEFAULT_NETWORK_KEY } from '../constants/localStorage'
import useLocalStorage from '../hooks/local_storage/useLocalStorage'
import coerce from './coerce'

export default function useDefaultNetwork(): Network {
  const [defaultNetworkLocalRaw, setDefaultNetwork] = useLocalStorage(LOCAL_STORAGE_DEFAULT_NETWORK_KEY)
  const defaultNetworkLocal = coerce(Network, defaultNetworkLocalRaw)
  if (!defaultNetworkLocal) {
    const defaultNetworkEnv = nullthrows(
      coerce(Network, process.env.REACT_APP_DEFAULT_NETWORK),
      'REACT_APP_DEFAULT_NETWORK is not defined'
    )
    setDefaultNetwork(defaultNetworkEnv)
    return defaultNetworkEnv
  } else {
    return defaultNetworkLocal
  }
}
