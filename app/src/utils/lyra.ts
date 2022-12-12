import Lyra from '@lyrafinance/lyra-js'

import { NETWORK_CONFIGS } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getChainForChainId from './getChainForChainId'
import getOptimismChainId from './getOptimismChainId'

const optimismChainId = getOptimismChainId()
const optimismNetworkConfig = NETWORK_CONFIGS[getChainForChainId(optimismChainId)]
const optimismProvider = new CachedStaticJsonRpcProvider(
  optimismNetworkConfig.readRpcUrls,
  optimismNetworkConfig.chainId
)
const lyra = new Lyra({
  provider: optimismProvider,
})

export default lyra
