import gql from 'graphql-tag'

import { OptimismChainId } from '@/app/constants/networks'

import { hopArbitrumClient, hopMainnetClient, hopPolygonClient, hopXDaiClient } from '../../apollo/client'
import useFetch from '../../data/useFetch'
import useWalletAccount from '../../wallet/useWalletAccount'

const transfersToL2Query = gql`
  query transferSentToL2S(
    $first: Int!
    $fromTimestamp: Int
    $from: String!
    $recipient: String!
    $destinationChainId: Int
  ) {
    transferSentToL2S(
      first: $first
      where: {
        timestamp_gte: $fromTimestamp
        from: $from
        recipient: $recipient
        destinationChainId: $destinationChainId
      }
    ) {
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
  query transferSents(
    $first: Int!
    $fromTimestamp: Int
    $from: String!
    $recipient: String!
    $destinationChainId: Int
  ) {
    transferSents(
      first: $first
      where: {
        timestamp_gte: $fromTimestamp
        from: $from
        recipient: $recipient
        destinationChainId: $destinationChainId
      }
    ) {
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
  first?: number
  fromTimestamp?: number
  from: string
  recipient: string
  destinationChainId: number
}

export const fetchTransfersSentToOptimism = async (account: string, startTimestamp: number) => {
  const variables: TransferSentToL2QueryVariables = {
    first: 1000,
    fromTimestamp: startTimestamp,
    from: account.toLowerCase(),
    recipient: account.toLowerCase(),
    destinationChainId: OptimismChainId.OptimismMainnet,
  }
  const [
    {
      data: { transferSentToL2S: mainnetTransferSentToL2S },
    },
    {
      data: { transferSents: arbitrumTransferSentToL2S },
    },
    {
      data: { transferSents: polygonTransferSentToL2S },
    },
    {
      data: { transferSents: xdaiTransferSentToL2S },
    },
  ] = await Promise.all([
    hopMainnetClient.query<{ transferSentToL2S: TransferSentToL2SResult[] }>({
      query: transfersToL2Query,
      variables: variables,
      fetchPolicy: 'cache-first',
    }),
    ...[hopArbitrumClient, hopPolygonClient, hopXDaiClient].map(client =>
      client.query<{ transferSents: TransferSentToL2SResult[] }>({
        query: transferSentsQuery,
        variables: variables,
        fetchPolicy: 'cache-first',
      })
    ),
  ])
  return [
    ...mainnetTransferSentToL2S,
    ...arbitrumTransferSentToL2S,
    ...polygonTransferSentToL2S,
    ...xdaiTransferSentToL2S,
  ]
}

const EMPTY: TransferSentToL2SResult[] = []

export default function useHopTransfersToOptimism(startTimestamp: number): TransferSentToL2SResult[] {
  const account = useWalletAccount()
  const [data] = useFetch(
    'HopTransfersToOptimism',
    account ? [account, startTimestamp] : null,
    fetchTransfersSentToOptimism
  )
  return data ?? EMPTY
}
