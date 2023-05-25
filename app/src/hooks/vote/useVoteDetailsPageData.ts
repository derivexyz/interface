import { useCallback } from 'react'

import { ContractId } from '@/app/constants/contracts'
import { FetchId } from '@/app/constants/fetch'
import { Proposal } from '@/app/constants/governance'
import { AppNetwork } from '@/app/constants/networks'
import { VoteQueryResult } from '@/app/constants/queries'
import { getContractAddress } from '@/app/utils/common/getContract'
import getProvider from '@/app/utils/getProvider'
import isMainnet from '@/app/utils/isMainnet'
import fetchLongExecutorData, { LongExecutorData } from '@/app/utils/vote/fetchLongExecutorData'
import fetchLyraGovernanceStrategyData, {
  LyraGovernanceStrategyData,
} from '@/app/utils/vote/fetchLyraGovernanceStrategyData'
import fetchProposal from '@/app/utils/vote/fetchProposal'
import fetchProposalCreatedEventsData from '@/app/utils/vote/fetchProposals'
import fetchShortExecutorData, { ShortExecutorData } from '@/app/utils/vote/fetchShortExecutorData'
import fetchVotes from '@/app/utils/vote/fetchVotes'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

export type VoteDetailsPageData = {
  proposal: Proposal
  executor: ShortExecutorData | LongExecutorData
  strategy: LyraGovernanceStrategyData
  votes: VoteQueryResult[]
  blockTimestamp: number
}

export const fetchVoteDetailsPageData = async (
  proposalId: string,
  account: string | null
): Promise<VoteDetailsPageData | null> => {
  const [allProposals, block] = await Promise.all([
    fetchProposalCreatedEventsData(),
    getProvider(AppNetwork.Ethereum).getBlock('latest'),
  ])
  const foundProposal = allProposals.find(proposal => proposal.id === proposalId)
  if (!foundProposal) {
    return null
  }

  const longExecutorAddress = getContractAddress(ContractId.LongExecutor)
  const isLongExecutor = foundProposal.executor.id.toLowerCase() === longExecutorAddress ? true : false
  // fetchLongExecutorData(proposalId)
  const [proposal, executor, strategy, votes] = await Promise.all([
    fetchProposal(proposalId),
    isLongExecutor && isMainnet() ? fetchLongExecutorData(proposalId) : fetchShortExecutorData(proposalId),
    fetchLyraGovernanceStrategyData(account),
    fetchVotes(proposalId),
  ])
  return {
    proposal,
    executor,
    strategy,
    votes,
    blockTimestamp: block.timestamp,
  }
}

export default function useVoteDetailsPageData(proposalId?: string): VoteDetailsPageData | null {
  const account = useWalletAccount()
  const [voteDetailsPageData] = useFetch(
    FetchId.VoteDetailsPageData,
    proposalId ? [proposalId, account] : null,
    fetchVoteDetailsPageData,
    {
      refreshInterval: 60 * 1000,
    }
  )
  return voteDetailsPageData
}

export function useMutateVoteDetailsPageData(proposalId: string) {
  const account = useWalletAccount()
  const mutate = useMutate(FetchId.VoteDetailsPageData, fetchVoteDetailsPageData)
  return useCallback(() => mutate(proposalId, account), [mutate, proposalId, account])
}
