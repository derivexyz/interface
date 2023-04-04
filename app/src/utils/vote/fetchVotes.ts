import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

import isMainnet from '@/app/utils/isMainnet'

import { AppChain } from '../../constants/networks'
import { VOTE_FRAGMENT, VoteQueryResult } from '../../constants/queries'
import getLyraGovernanceSubgraphURI from '../../utils/getLyraGovernanceSubgraphURI'

const voteQuery = gql`
  query votes($proposalId: String!) {
    votes(where: { proposal: $proposalId }) {
      ${VOTE_FRAGMENT}
    }
  }
`

type VoteVariables = {
  proposalId: string
}

export const EMPTY_VOTES: VoteQueryResult[] = []

const fetchVotesSubgraphData = async (proposalId: string): Promise<VoteQueryResult[]> => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: getLyraGovernanceSubgraphURI(isMainnet() ? AppChain.Ethereum : AppChain.EthereumGoerli),
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  const { data } = await client.query<{ votes: VoteQueryResult[] }, VoteVariables>({
    query: voteQuery,
    variables: {
      proposalId: proposalId,
    },
  })
  return data.votes
}

const fetchVotes = async (proposalId: string): Promise<VoteQueryResult[]> => {
  return await fetchVotesSubgraphData(proposalId)
}

export default fetchVotes
