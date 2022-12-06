import nullthrows from 'nullthrows'

import { LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY } from '../constants/localStorage'
import isServer from './isServer'

export default function getOptimismChainId(): number {
  const defaultOptimismChainId = nullthrows(
    parseInt(process.env.NEXT_PUBLIC_DEFAULT_OPTIMISM_CHAIN_ID ?? ''),
    'NEXT_PUBLIC_DEFAULT_OPTIMISM_CHAIN_ID environment variable is not a valid chain ID'
  )
  if (isServer()) {
    // Always use default chain ID server-side
    // This has implications for meta tag population
    return defaultOptimismChainId
  }
  const rawOptimismChainId = localStorage.getItem(LOCAL_STORAGE_OPTIMISM_CHAIN_ID_KEY)
  const optimismChainId = rawOptimismChainId ? parseInt(rawOptimismChainId) : null
  if (rawOptimismChainId && !optimismChainId) {
    console.warn('Local storage chain ID is invalid, using default')
  }
  return optimismChainId ? optimismChainId : defaultOptimismChainId
}
