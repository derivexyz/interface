import { GraphQLClient } from 'graphql-request'
import gql from 'graphql-tag'

export const hopMainnetClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet')
export const hopPolygonClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon')
export const hopXDaiClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai')
export const hopArbitrumClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum')

const transfersToL2Query = gql`
  query transferSentToL2S($recipient: [String!]!) {
    transferSentToL2S(first: 1000, where: { recipient_in: $recipient, destinationChainId: 10 }) {
      id
      blockNumber
      contractAddress
      deadline
      destinationChainId
      from
      relayerFee
      recipient
      relayer
      timestamp
      token
      transactionHash
      transactionIndex
    }
  }
`

const transferSentsQuery = gql`
  query transferSents($recipient: [String!]!) {
    transferSents(first: 1000, where: { recipient_in: $recipient, destinationChainId: 10 }) {
      amount
      amountOutMin
      blockNumber
      contractAddress
      bonderFee
      destinationChainId
      deadline
      from
      id
      index
      recipient
      timestamp
      token
      transactionHash
      transactionIndex
      transferId
      transferNonce
    }
  }
`

type TransferSentToL2SResult = {
  id: string
  blockNumber: number
  contractAddress: string
  deadline: number
  destinationChainId: number
  from: string
  recipient: string
  timestamp: number
  token: string
}

export type TransferSentToL2QueryVariables = {
  recipient: string[]
}

const CHUNK = 250

export const fetchHopTransfers = async (accounts: string[]) => {
  const chunks: string[][] = []
  for (let i = 0; i < accounts.length; i += CHUNK) {
    const chunk = accounts.slice(i, i + CHUNK)
    chunks.push(chunk)
  }

  const transfers = (
    await Promise.all(
      chunks.map(async accounts => {
        const variables: TransferSentToL2QueryVariables = {
          recipient: accounts.map(a => a.toLowerCase()),
        }
        const [
          { transferSentToL2S: mainnetTransferSentToL2S },
          { transferSents: arbitrumTransferSentToL2S },
          { transferSents: polygonTransferSentToL2S },
          { transferSents: xdaiTransferSentToL2S },
        ] = await Promise.all([
          hopMainnetClient.request<{
            transferSentToL2S: TransferSentToL2SResult[]
          }>(transfersToL2Query, variables),
          ...[hopArbitrumClient, hopPolygonClient, hopXDaiClient].map(client =>
            client.request<{ transferSents: TransferSentToL2SResult[] }>(transferSentsQuery, variables)
          ),
        ])
        const transfers = [
          ...mainnetTransferSentToL2S,
          ...arbitrumTransferSentToL2S,
          ...polygonTransferSentToL2S,
          ...xdaiTransferSentToL2S,
        ].filter(t => t.from === t.recipient)
        return transfers
      })
    )
  ).flat()

  return accounts.map(account => {
    const accountTransfers = transfers.filter(t => t.recipient.toLowerCase() === account.toLowerCase())
    return {
      account,
      transfers: accountTransfers,
    }
  })
}
