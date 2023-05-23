import Lyra, { Chain, Version } from '@lyrafinance/lyra-js'

import { LyraNetwork } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getNetworkConfig from './getNetworkConfig'
import isMainnet from './isMainnet'

const optimismNetworkConfig = getNetworkConfig(LyraNetwork.Optimism)
const optimismProvider = new CachedStaticJsonRpcProvider(optimismNetworkConfig.rpcUrl, optimismNetworkConfig.chainId)

const arbitrumNetworkConfig = getNetworkConfig(LyraNetwork.Arbitrum)
export const arbitrumProvider = new CachedStaticJsonRpcProvider(
  arbitrumNetworkConfig.rpcUrl,
  arbitrumNetworkConfig.chainId
)

const getLyraSubgraphURI = (chain: Chain, version: Version): string | undefined => {
  const SATSUMA_API_KEY = process.env.REACT_APP_SATSUMA_API_KEY
  if (!SATSUMA_API_KEY) {
    // Use SDK default
    return
  }
  switch (chain) {
    case Chain.Optimism:
      switch (version) {
        case Version.Avalon:
          return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-mainnet/api`
        case Version.Newport:
          return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-mainnet-newport/api`
      }
    case Chain.OptimismGoerli:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-goerli/api`
    case Chain.Arbitrum:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-mainnet/api`
    case Chain.ArbitrumGoerli:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-goerli/api`
  }
}

export const lyraOptimism = new Lyra({
  provider: optimismProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(isMainnet() ? Chain.Optimism : Chain.OptimismGoerli, Version.Newport),
  version: Version.Newport,
})

export const lyraAvalon = new Lyra({
  provider: optimismProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(isMainnet() ? Chain.Optimism : Chain.OptimismGoerli, Version.Avalon),
  version: Version.Avalon,
})

export const lyraArbitrum = new Lyra({
  provider: arbitrumProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(isMainnet() ? Chain.Arbitrum : Chain.ArbitrumGoerli, Version.Newport),
})
