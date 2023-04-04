import { MAX_BN } from '@/app/constants/bn'
import { ContractId, ContractMap } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import fromBigNumber from '@/app/utils/fromBigNumber'
import mainnetProvider from '@/app/utils/mainnetProvider'

import getContract from '../common/getContract'
import multicall, { MulticallRequest } from '../common/multicall'

export type LongExecutorData = {
  gracePeriod: number
  minimumQuorum: number
  oneHundredWithPrecision: number
  propositionThreshold: number
  minimumVoteDifferential: number
  votingDuration: number
  minimumPropositionPower: number
  isQuorumValid: boolean
  isVoteDifferentialValid: boolean
}

export const EMPTY_LONG_EXECUTOR_DATA: LongExecutorData = {
  gracePeriod: fromBigNumber(MAX_BN),
  minimumQuorum: fromBigNumber(MAX_BN),
  oneHundredWithPrecision: fromBigNumber(MAX_BN),
  propositionThreshold: fromBigNumber(MAX_BN),
  minimumVoteDifferential: fromBigNumber(MAX_BN),
  votingDuration: fromBigNumber(MAX_BN),
  minimumPropositionPower: fromBigNumber(MAX_BN),
  isQuorumValid: false,
  isVoteDifferentialValid: false,
}

const fetchLongExecutorData = async (proposalId?: string): Promise<LongExecutorData> => {
  const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
  const shortExecutorContract = getContract(ContractId.LongExecutor, AppNetwork.Ethereum)
  const latestBlockNumber = (await mainnetProvider.getBlock('latest')).number
  const [isQuorumValid, isVoteDifferentialValid] = await Promise.all([
    proposalId ? shortExecutorContract.isQuorumValid(lyraGovernanceV2Contract.address, proposalId) : false,
    proposalId ? shortExecutorContract.isVoteDifferentialValid(lyraGovernanceV2Contract.address, proposalId) : false,
  ])

  const [
    {
      returnData: [
        [gracePeriod],
        [minimumQuorum],
        [oneHundredWithPrecision],
        [propositionThreshold],
        [minimumVoteDifferential],
        [votingDuration],
        [minimumPropositionPower],
      ],
    },
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'GRACE_PERIOD'>,
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'MINIMUM_QUORUM'>,
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'ONE_HUNDRED_WITH_PRECISION'>,
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'PROPOSITION_THRESHOLD'>,
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'VOTE_DIFFERENTIAL'>,
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'VOTING_DURATION'>,
        MulticallRequest<ContractMap[ContractId.LongExecutor], 'getMinimumPropositionPowerNeeded'>
      ]
    >(AppNetwork.Ethereum, [
      {
        contract: shortExecutorContract,
        function: 'GRACE_PERIOD',
        args: [],
      },
      {
        contract: shortExecutorContract,
        function: 'MINIMUM_QUORUM',
        args: [],
      },
      {
        contract: shortExecutorContract,
        function: 'ONE_HUNDRED_WITH_PRECISION',
        args: [],
      },
      {
        contract: shortExecutorContract,
        function: 'PROPOSITION_THRESHOLD',
        args: [],
      },
      {
        contract: shortExecutorContract,
        function: 'VOTE_DIFFERENTIAL',
        args: [],
      },
      {
        contract: shortExecutorContract,
        function: 'VOTING_DURATION',
        args: [],
      },
      {
        contract: shortExecutorContract,
        function: 'getMinimumPropositionPowerNeeded',
        args: [lyraGovernanceV2Contract.address, latestBlockNumber],
      },
    ]),
  ])

  return {
    gracePeriod: gracePeriod.toNumber(),
    minimumQuorum: fromBigNumber(minimumQuorum),
    oneHundredWithPrecision: fromBigNumber(oneHundredWithPrecision),
    propositionThreshold: fromBigNumber(propositionThreshold),
    minimumVoteDifferential: fromBigNumber(minimumVoteDifferential),
    votingDuration: fromBigNumber(votingDuration),
    minimumPropositionPower: fromBigNumber(minimumPropositionPower),
    isQuorumValid,
    isVoteDifferentialValid,
  }
}

export default fetchLongExecutorData
