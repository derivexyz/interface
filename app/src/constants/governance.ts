import { getContractAddress } from '../utils/common/getContract'
import { ProposalMetaData } from '../utils/vote/fetchIPFSHash'
import { ProposalContractData } from '../utils/vote/fetchProposal'
import { ContractId } from './contracts'
import { ProposalCreatedQueryResult } from './queries'

export enum ProposalState {
  Pending = 'Pending',
  Active = 'Active',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Canceled = 'Canceled',
  Queued = 'Queued',
  Expired = 'Expired',
  Executed = 'Executed',
}

export enum ProposalAction {
  TransferEth = 'TransferEth',
  Transfer = 'Transfer',
  MetaGovernance = 'MetaGovernance',
  Custom = 'Custom',
}

export enum Vote {
  For = 'For',
  Against = 'Against',
}

export type Proposal = ProposalCreatedQueryResult &
  ProposalContractData &
  ProposalMetaData & {
    startTimestamp: number
    endTimestamp: number
  }

export const PROPOSAL_STATE_MAPPING: Record<number, ProposalState> = {
  0: ProposalState.Pending,
  1: ProposalState.Canceled,
  2: ProposalState.Active,
  3: ProposalState.Failed,
  4: ProposalState.Succeeded,
  5: ProposalState.Queued,
  6: ProposalState.Expired,
  7: ProposalState.Executed,
}

export type Executor = {
  action: ProposalAction
  address: string
  label: string
}

export const EXECUTORS: Executor[] = [
  {
    action: ProposalAction.Transfer,
    address: getContractAddress(ContractId.ShortExecutor),
    label: 'Transfer ERC20 (Short Time-Lock Executor)',
  },
  {
    action: ProposalAction.TransferEth,
    address: getContractAddress(ContractId.ShortExecutor),
    label: 'Transfer ETH (Short Time-Lock Executor)',
  },
  {
    action: ProposalAction.MetaGovernance,
    address: getContractAddress(ContractId.LongExecutor),
    label: 'Meta Governance (Long Time-Lock Executor)',
  },
  {
    action: ProposalAction.Custom,
    address: getContractAddress(ContractId.LongExecutor),
    label: 'Custom (Long Time-Lock Executor)',
  },
]
