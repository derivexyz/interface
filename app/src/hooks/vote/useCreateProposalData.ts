import { FetchId } from '@/app/constants/fetch'
import isMainnet from '@/app/utils/isMainnet'
import fetchLongExecutorData, {
  EMPTY_LONG_EXECUTOR_DATA,
  LongExecutorData,
} from '@/app/utils/vote/fetchLongExecutorData'
import fetchLyraGovernanceStrategyData, {
  EMPTY_LYRA_GOVERNANCE_STRATEGY_DATA,
  LyraGovernanceStrategyData,
} from '@/app/utils/vote/fetchLyraGovernanceStrategyData'
import fetchShortExecutorData, {
  EMPTY_SHORT_EXECUTOR_DATA,
  ShortExecutorData,
} from '@/app/utils/vote/fetchShortExecutorData'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

export type CreateProposalData = {
  governance: LyraGovernanceStrategyData
  shortExecutor: ShortExecutorData
  longExecutor: LongExecutorData
}

export const EMPTY_CREATE_PROPOSAL_DATA: CreateProposalData = {
  governance: EMPTY_LYRA_GOVERNANCE_STRATEGY_DATA,
  shortExecutor: EMPTY_SHORT_EXECUTOR_DATA,
  longExecutor: EMPTY_LONG_EXECUTOR_DATA,
}

export const fetchCreateProposalData = async (
  account: string | null,
  proposalId?: string
): Promise<CreateProposalData> => {
  const [governance, shortExecutor, longExecutor] = await Promise.all([
    fetchLyraGovernanceStrategyData(account),
    fetchShortExecutorData(proposalId),
    isMainnet() ? fetchLongExecutorData(proposalId) : EMPTY_LONG_EXECUTOR_DATA,
  ])
  return {
    governance,
    shortExecutor,
    longExecutor,
  }
}

export default function useCreateProposalData(proposalId?: string): CreateProposalData {
  const account = useWalletAccount()
  const [lyraGovernanceStrategyData] = useFetch(
    FetchId.LyraGovernanceData,
    account ? [account, proposalId] : null,
    fetchCreateProposalData,
    {
      refreshInterval: 60 * 1000,
    }
  )
  return lyraGovernanceStrategyData ?? EMPTY_CREATE_PROPOSAL_DATA
}
