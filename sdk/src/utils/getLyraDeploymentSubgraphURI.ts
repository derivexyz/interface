import { Chain } from '../constants/chain'
import { Version } from '../lyra'

const getLyraDeploymentSubgraphURI = (chain: Chain, version: Version = Version.Newport): string => {
  switch (chain) {
    case Chain.Optimism:
      switch (version) {
        case Version.Newport:
          return 'https://subgraph.satsuma-prod.com/d14de8f7fd46/lyra/optimism-mainnet-newport/api'
        case Version.Avalon:
          return 'https://subgraph.satsuma-prod.com/d14de8f7fd46/lyra/optimism-mainnet/api'
      }
    /*eslint-disable-next-line no-fallthrough */
    case Chain.OptimismGoerli:
      return 'https://subgraph.satsuma-prod.com/d14de8f7fd46/lyra/optimism-goerli/api'
    case Chain.Arbitrum:
      return 'https://subgraph.satsuma-prod.com/d14de8f7fd46/lyra/arbitrum-mainnet/api'
    case Chain.ArbitrumGoerli:
      return 'https://subgraph.satsuma-prod.com/d14de8f7fd46/lyra/arbitrum-goerli/api'
  }
}

export default getLyraDeploymentSubgraphURI
