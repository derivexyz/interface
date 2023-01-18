import Lyra, { Version } from '@lyrafinance/lyra-js'

import { NETWORK_CONFIGS } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getArbitrumChainId from './getArbitrumChainId'
import getChainForChainId from './getChainForChainId'
import getOptimismChainId from './getOptimismChainId'
import mainnetProvider from './mainnetProvider'

const optimismChainId = getOptimismChainId()
const optimismNetworkConfig = NETWORK_CONFIGS[getChainForChainId(optimismChainId)]
const optimismProvider = new CachedStaticJsonRpcProvider(
  optimismNetworkConfig.readRpcUrls,
  optimismNetworkConfig.chainId
)

const arbitrumChainId = getArbitrumChainId()
const arbitrumNetworkConfig = NETWORK_CONFIGS[getChainForChainId(arbitrumChainId)]
const arbitrumProvider = new CachedStaticJsonRpcProvider(
  arbitrumNetworkConfig.readRpcUrls,
  arbitrumNetworkConfig.chainId
)

export const lyraOptimism = new Lyra({
  provider: optimismProvider,
  optimismProvider: optimismProvider,
  ethereumProvider: mainnetProvider,
})

export const lyraArbitrum = new Lyra(
  { provider: arbitrumProvider, optimismProvider: optimismProvider, ethereumProvider: mainnetProvider },
  Version.Newport
)
