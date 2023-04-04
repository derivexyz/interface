import { ZERO_BN } from '@/app/constants/bn'
import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import fromBigNumber from '@/app/utils/fromBigNumber'
import mainnetProvider from '@/app/utils/mainnetProvider'

import getContract from '../common/getContract'

export type LyraGovernanceStrategyData = {
  propositionPower: number
  totalVotingSupply: number
  votingPower: number
}

export const EMPTY_LYRA_GOVERNANCE_STRATEGY_DATA = {
  propositionPower: 0,
  totalVotingSupply: 0,
  votingPower: 0,
}

const fetchLyraGovernanceStrategyData = async (account: string | null): Promise<LyraGovernanceStrategyData> => {
  const lyraGovernanceStrategyContract = getContract(ContractId.LyraGovernanceStrategy, AppNetwork.Ethereum)
  const latestBlockNumber = (await mainnetProvider.getBlock('latest')).number
  const [propositionPower, totalVotingSupply, votingPower] = await Promise.all([
    account ? lyraGovernanceStrategyContract.getPropositionPowerAt(account, latestBlockNumber) : ZERO_BN,
    lyraGovernanceStrategyContract.getTotalVotingSupplyAt(latestBlockNumber),
    account ? lyraGovernanceStrategyContract.getVotingPowerAt(account, latestBlockNumber) : ZERO_BN,
  ])

  return {
    propositionPower: fromBigNumber(propositionPower),
    totalVotingSupply: fromBigNumber(totalVotingSupply),
    votingPower: fromBigNumber(votingPower),
  }
}

export default fetchLyraGovernanceStrategyData
