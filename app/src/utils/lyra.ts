import Lyra, { Network, Version } from '@lyrafinance/lyra-js'

import { LyraNetwork } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getNetworkConfig from './getNetworkConfig'
import isMainnet from './isMainnet'

const optimismNetworkConfig = getNetworkConfig(LyraNetwork.Optimism)
const optimismProvider = new CachedStaticJsonRpcProvider(optimismNetworkConfig.rpcUrl, optimismNetworkConfig.chainId)

const arbitrumNetworkConfig = getNetworkConfig(LyraNetwork.Arbitrum)
const arbitrumProvider = new CachedStaticJsonRpcProvider(arbitrumNetworkConfig.rpcUrl, arbitrumNetworkConfig.chainId)

const getLyraSubgraphURI = (network: Network, version: Version): string | undefined => {
  const SATSUMA_API_KEY = process.env.REACT_APP_SATSUMA_API_KEY
  if (!SATSUMA_API_KEY) {
    // Use SDK default
    return
  }
  switch (network) {
    case Network.Optimism:
      return isMainnet()
        ? version === Version.Avalon
          ? `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-mainnet/api`
          : `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-mainnet-newport/api`
        : `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-goerli/api`
    case Network.Arbitrum:
      return isMainnet()
        ? `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-mainnet/api`
        : `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-goerli/api`
  }
}

const getLyraGovSubgraphURI = (network: Network): string | undefined => {
  const SATSUMA_API_KEY = process.env.REACT_APP_SATSUMA_API_KEY
  if (!SATSUMA_API_KEY) {
    // Use SDK default
    return
  }
  switch (network) {
    case Network.Optimism:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-governance/api`
    case Network.Arbitrum:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-governance/api`
  }
}

export const lyraOptimism = new Lyra({
  provider: optimismProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(Network.Optimism, Version.Newport),
  govSubgraphUri: getLyraGovSubgraphURI(Network.Optimism),
  version: Version.Newport,
})

// TODO: @xuwu remove avalon version
export const lyraAvalon = new Lyra({
  provider: optimismProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(Network.Optimism, Version.Avalon),
  govSubgraphUri: getLyraGovSubgraphURI(Network.Optimism),
  version: Version.Avalon,
})

export const lyraArbitrum = new Lyra({
  provider: arbitrumProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(Network.Arbitrum, Version.Newport),
  govSubgraphUri: getLyraGovSubgraphURI(Network.Arbitrum),
  version: Version.Newport,
})
