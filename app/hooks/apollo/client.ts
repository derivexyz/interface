import { ApolloClient, InMemoryCache } from '@apollo/client'

import isOptimismMainnet from '@/app/utils/isOptimismMainnet'

export const SNAPSHOT_RESULT_LIMIT = 1000

export const synthetixClient = new ApolloClient({
  uri: isOptimismMainnet()
    ? 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-latest-rates'
    : 'https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-kovan-main',
  cache: new InMemoryCache(),
})

export const hopMainnetClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet',
  cache: new InMemoryCache(),
})

export const hopPolygonClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon',
  cache: new InMemoryCache(),
})

export const hopXDaiClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai',
  cache: new InMemoryCache(),
})
export const hopArbitrumClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum',
  cache: new InMemoryCache(),
})
