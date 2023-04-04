import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

import { ZERO_BN } from '@/app/constants/bn'
import { ContractId } from '@/app/constants/contracts'
import { Proposal, PROPOSAL_STATE_MAPPING, ProposalState } from '@/app/constants/governance'
import { SECONDS_IN_DAY } from '@/app/constants/time'
import fromBigNumber from '@/app/utils/fromBigNumber'
import isMainnet from '@/app/utils/isMainnet'

import { AppChain, AppNetwork } from '../../constants/networks'
import { PROPOSAL_FRAGMENT, ProposalCreatedQueryResult } from '../../constants/queries'
import getLyraGovernanceSubgraphURI from '../../utils/getLyraGovernanceSubgraphURI'
import getContract from '../common/getContract'
import fetchIPFSHash from './fetchIPFSHash'

const proposalCreatedQuery = gql`
  query proposal($id: String!) {
    proposal(id: $id ) {
      ${PROPOSAL_FRAGMENT}
    }
  }
`

type ProposalCreatedVariables = {
  id: string
}

export type ProposalContractData = {
  forVotes: number
  againstVotes: number
  creator: string
  proposalState: ProposalState
}

export const EMPTY_PROPOSAL: Proposal = {
  id: '',
  timestamp: 0,
  ipfsHash: '',
  state: '',
  title: '',
  summary: '',
  motivation: '',
  specification: '',
  references: '',
  startTimestamp: 0,
  endTimestamp: 0,
  forVotes: 0,
  againstVotes: 0,
  creator: '',
  proposalState: ProposalState.Pending,
  executorId: '',
  executor: {
    id: '',
  },
  signatures: '',
  targets: '',
  tokenAddress: '',
  executionTime: null,
  tokenAmount: ZERO_BN,
  ethAmount: ZERO_BN,
}

const fetchProposalSubgraphData = async (proposalId: string): Promise<ProposalCreatedQueryResult> => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: getLyraGovernanceSubgraphURI(isMainnet() ? AppChain.Ethereum : AppChain.EthereumGoerli),
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  const { data } = await client.query<{ proposal: ProposalCreatedQueryResult }, ProposalCreatedVariables>({
    query: proposalCreatedQuery,
    variables: {
      id: proposalId,
    },
  })
  return data.proposal
}

export const fetchProposalContractData = async (proposalId: string): Promise<ProposalContractData> => {
  const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
  const [proposal, proposalStateEnum] = await Promise.all([
    lyraGovernanceV2Contract.getProposalById(proposalId),
    lyraGovernanceV2Contract.getProposalState(proposalId),
  ])
  const proposalState = PROPOSAL_STATE_MAPPING[proposalStateEnum]
  const forVotes = fromBigNumber(proposal.forVotes)
  const againstVotes = fromBigNumber(proposal.againstVotes)
  const creator = proposal.creator
  return {
    forVotes,
    againstVotes,
    creator,
    proposalState,
  }
}

const fetchProposal = async (proposalId: string): Promise<Proposal> => {
  const [proposalSubgraphData, proposalContractData] = await Promise.all([
    fetchProposalSubgraphData(proposalId),
    fetchProposalContractData(proposalId),
  ])

  const proposalIpfsData = await fetchIPFSHash(proposalSubgraphData.ipfsHash)
  return {
    ...proposalSubgraphData,
    ...proposalContractData,
    ...proposalIpfsData,
    startTimestamp: proposalSubgraphData.timestamp + SECONDS_IN_DAY * 1, // TODO: @dillon - fetch from contract real time? Need to ask DOM
    endTimestamp: proposalSubgraphData.timestamp + SECONDS_IN_DAY * 4, // TODO: @dillon - fetch from contract real time? Need to ask DOM
  }
}

export default fetchProposal
