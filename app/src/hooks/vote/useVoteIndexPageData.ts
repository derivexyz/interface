import { useCallback } from 'react'

import { ContractId } from '@/app/constants/contracts'
import { FetchId } from '@/app/constants/fetch'
import { Proposal } from '@/app/constants/governance'
import { AppNetwork } from '@/app/constants/networks'
import getContract from '@/app/utils/common/getContract'
import fromBigNumber from '@/app/utils/fromBigNumber'
import fetchProposal from '@/app/utils/vote/fetchProposal'
import fetchProposalCreatedEventsData from '@/app/utils/vote/fetchProposals'

import useFetch, { useMutate } from '../data/useFetch'

export type VoteIndexPageData = {
  proposals: Proposal[]
  count: number
}

export const EMPTY_VOTE_INDEX_PAGE_DATA: VoteIndexPageData = {
  proposals: [],
  count: 0,
}

export const fetchVoteIndexPageData = async (): Promise<VoteIndexPageData> => {
  const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
  const [proposalsCreated, proposalCount] = await Promise.all([
    fetchProposalCreatedEventsData(),
    lyraGovernanceV2Contract.getProposalsCount(),
  ])
  const proposals: Proposal[] = await Promise.all(proposalsCreated.map(async proposal => fetchProposal(proposal.id)))
  return {
    proposals: proposals,
    count: fromBigNumber(proposalCount),
  }
}

export default function useVoteIndexPageData(): VoteIndexPageData {
  const [voteIndexPageData] = useFetch(FetchId.VoteIndexPageData, [], fetchVoteIndexPageData, {
    refreshInterval: 60 * 1000,
  })
  return voteIndexPageData ?? EMPTY_VOTE_INDEX_PAGE_DATA
}

export function useMutateVoteIndexPageData() {
  const mutate = useMutate(FetchId.VoteIndexPageData, fetchVoteIndexPageData)
  return useCallback(() => mutate(), [mutate])
}
