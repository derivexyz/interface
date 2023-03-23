import Lyra from '@lyrafinance/lyra-js'

import { LyraNetwork } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getNetworkConfig from './getNetworkConfig'
import mainnetProvider from './mainnetProvider'

const optimismNetworkConfig = getNetworkConfig(LyraNetwork.Optimism)
const optimismProvider = new CachedStaticJsonRpcProvider(
  optimismNetworkConfig.readRpcUrls,
  optimismNetworkConfig.chainId
)

const arbitrumNetworkConfig = getNetworkConfig(LyraNetwork.Arbitrum)
export const arbitrumProvider = new CachedStaticJsonRpcProvider(
  arbitrumNetworkConfig.readRpcUrls,
  arbitrumNetworkConfig.chainId
)

export const lyraOptimism = new Lyra({
  provider: optimismProvider,
  apiUri: process.env.REACT_APP_API_URL,
  optimismProvider: optimismProvider,
  ethereumProvider: mainnetProvider,
})

export const lyraArbitrum = new Lyra({
  provider: arbitrumProvider,
  apiUri: process.env.REACT_APP_API_URL,
  optimismProvider: optimismProvider,
  ethereumProvider: mainnetProvider,
})
