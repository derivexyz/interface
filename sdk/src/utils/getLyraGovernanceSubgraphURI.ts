import { Chain } from '../constants/chain'
import { LYRA_API_URL } from '../constants/links'

const getLyraGovernanceSubgraphURI = (chain: Chain | 'ethereum'): string => {
  switch (chain) {
    case 'ethereum':
    case Chain.Optimism:
    case Chain.OptimismGoerli:
      return new URL(`/subgraph/optimism-governance/v1/api`, LYRA_API_URL).toString()
    case Chain.Arbitrum:
    case Chain.ArbitrumGoerli:
      return new URL(`/subgraph/arbitrum-governance/v1/api`, LYRA_API_URL).toString()
  }
}

export default getLyraGovernanceSubgraphURI
