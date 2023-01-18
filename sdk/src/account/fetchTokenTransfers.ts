import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import fetch from 'cross-fetch'

import { TokenTransfer, TokenTransferResult } from '../constants/queries'
import Lyra, { Deployment } from '../lyra'

const TOKEN_TRANSFER_QUERY = `
  amount
  timestamp
  blockNumber
  from
  to
  token {
    id
  }
`

const transfersQuery = gql`
  query tokenTransfers($owner: String!, $startTimestamp: Int!) {
    # From transfers
    fromTokenTransfers: tokenTransfers(
      first: 1000
      orderBy: timestamp
      orderDirection: asc
      where: { from: $owner, timestamp_gte: $startTimestamp }
    ) {
      ${TOKEN_TRANSFER_QUERY}
    }
    # To transfers
    toTokenTransfers: tokenTransfers(
      first: 1000
      orderBy: timestamp
      orderDirection: asc
      where: { to: $owner, timestamp_gte: $startTimestamp }
    ) {
      ${TOKEN_TRANSFER_QUERY}
    }
  }
`

const transfersSubgraph = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/paulvaden/transfers-test', fetch }),
  cache: new InMemoryCache(),
})

export default async function fetchTokenTransfers(
  lyra: Lyra,
  owner: string,
  startTimestamp: number
): Promise<{
  from: TokenTransfer[]
  to: TokenTransfer[]
}> {
  if (lyra.deployment !== Deployment.Mainnet) {
    // subgraph only supported on mainnet
    return {
      from: [],
      to: [],
    }
  }
  const { data } = await transfersSubgraph.query<
    {
      fromTokenTransfers: TokenTransferResult[]
      toTokenTransfers: TokenTransferResult[]
    },
    {
      owner: string
      startTimestamp: number
    }
  >({
    query: transfersQuery,
    variables: {
      owner: owner.toLowerCase(),
      startTimestamp,
    },
  })

  const from = data.fromTokenTransfers.map(token => ({
    amount: BigNumber.from(token.amount),
    timestamp: token.timestamp,
    blockNumber: token.blockNumber,
    from: getAddress(token.from),
    to: getAddress(token.to),
    tokenAddress: getAddress(token.token.id),
  }))

  const to = data.toTokenTransfers.map(token => ({
    amount: BigNumber.from(token.amount),
    timestamp: token.timestamp,
    blockNumber: token.blockNumber,
    from: getAddress(token.from),
    to: getAddress(token.to),
    tokenAddress: getAddress(token.token.id),
  }))

  return { from, to }
}
