import nullthrows from 'nullthrows'

import { LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY } from '../constants/localStorage'

export default function getOptimismChainId(): number {
  const defaultOptimismChainId = nullthrows(
    parseInt(process.env.REACT_APP_DEFAULT_OPTIMISM_CHAIN_ID ?? ''),
    'REACT_APP_DEFAULT_OPTIMISM_CHAIN_ID environment variable is not a valid chain ID'
  )
  const rawOptimismChainId = localStorage.getItem(LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY)
  const optimismChainId = rawOptimismChainId ? parseInt(rawOptimismChainId) : null
  if (rawOptimismChainId && !optimismChainId) {
    console.warn('Local storage chain ID is invalid, using default')
  }
  return optimismChainId ? optimismChainId : defaultOptimismChainId
}
