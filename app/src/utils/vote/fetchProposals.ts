import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

import { ProposalState } from '@/app/constants/governance'
import isMainnet from '@/app/utils/isMainnet'

import { AppChain } from '../../constants/networks'
import { PROPOSAL_FRAGMENT, ProposalCreatedQueryResult } from '../../constants/queries'
import getLyraGovernanceSubgraphURI from '../../utils/getLyraGovernanceSubgraphURI'

const proposalCreatedQuery = gql`
  query proposals($state: [String!]) {
    proposals(orderBy: timestamp, orderDirection: desc) {
      ${PROPOSAL_FRAGMENT}
    }
  }
`

type ProposalCreatedVariables = {
  state: string[]
}

const fetchProposalCreatedEventsData = async (): Promise<ProposalCreatedQueryResult[]> => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: getLyraGovernanceSubgraphURI(isMainnet() ? AppChain.Ethereum : AppChain.EthereumGoerli),
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  const { data } = await client.query<{ proposals: ProposalCreatedQueryResult[] }, ProposalCreatedVariables>({
    query: proposalCreatedQuery,
    variables: {
      state: [
        ProposalState.Pending,
        ProposalState.Active,
        ProposalState.Succeeded,
        ProposalState.Failed,
        ProposalState.Canceled,
        ProposalState.Queued,
        ProposalState.Executed,
      ],
    },
  })
  return data.proposals
}

export default fetchProposalCreatedEventsData
