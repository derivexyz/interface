import Lyra from '@lyrafinance/lyra-js'

import { NETWORK_CONFIGS } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getOptimismChainId from './getOptimismChainId'

const optimismChainId = getOptimismChainId()
const networkConfig = NETWORK_CONFIGS[optimismChainId]
const optimismProvider = new CachedStaticJsonRpcProvider(networkConfig.readRpcUrls, networkConfig.chainId)
const lyra = new Lyra({
  provider: optimismProvider,
  subgraphUri: 'https://subgraph.satsuma.xyz/lyra/optimism-mainnet/api',
})
export default lyra
