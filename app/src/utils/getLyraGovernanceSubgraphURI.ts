import { AppChain } from '../constants/networks'

const getLyraGovernanceSubgraphURI = (appChain: AppChain): string => {
  switch (appChain) {
    case AppChain.Arbitrum:
    case AppChain.Ethereum:
    case AppChain.Optimism:
      return 'https://subgraph.satsuma-prod.com/sw9vuxiQey3c/lyra/mainnet-governance/api'
    case AppChain.ArbitrumGoerli:
    case AppChain.EthereumGoerli:
    case AppChain.OptimismGoerli:
      return 'https://subgraph.satsuma-prod.com/sw9vuxiQey3c/lyra/goerli-governance/api'
  }
}

export default getLyraGovernanceSubgraphURI
