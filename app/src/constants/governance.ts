import { getContractAddress } from '../utils/common/getContract'
import { ProposalMetaData } from '../utils/vote/fetchIPFSHash'
import { ProposalContractData } from '../utils/vote/fetchProposal'
import { ContractId } from './contracts'
import { ProposalCreatedQueryResult } from './queries'

export const ARBITRUM_GOERLI_TARGET_ADDRESS = '0x6BEbC4925716945D46F0Ec336D5C2564F419682C'
export const ARBITRUM_MAINNET_TARGET_ADDRESS = '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f'
export const OPTIMISM_GOERLI_TARGET_ADDRESS = '0x5086d1eEF304eb5284A0f6720f79403b4e9bE294'
export const OPTIMISM_MAINNET_TARGET_ADDRESS = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'

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
  CustomArbitrum = 'CustomArbitrum',
  CustomOptimism = 'CustomOptimism',
  CustomEthereum = 'CustomEthereum',
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
    action: ProposalAction.CustomEthereum,
    address: getContractAddress(ContractId.LongExecutor),
    label: 'Custom Ethereum (Long Time-Lock Executor)',
  },
  {
    action: ProposalAction.CustomArbitrum,
    address: getContractAddress(ContractId.ShortExecutor),
    label: 'Custom Arbitrum (Short Time-Lock Executor)',
  },
  {
    action: ProposalAction.CustomOptimism,
    address: getContractAddress(ContractId.ShortExecutor),
    label: 'Custom Optimism (Short Time-Lock Executor)',
  },
]
