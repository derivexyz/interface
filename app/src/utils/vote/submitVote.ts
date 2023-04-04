import { PopulatedTransaction } from 'ethers'

import { ContractId } from '@/app/constants/contracts'
import { Vote } from '@/app/constants/governance'
import { AppChain, AppNetwork, NETWORK_CONFIGS } from '@/app/constants/networks'
import buildTx from '@/app/utils/buildTx'
import isMainnet from '@/app/utils/isMainnet'
import mainnetProvider from '@/app/utils/mainnetProvider'

import getContract from '../common/getContract'

export const submitVote = async (account: string, proposalId: number, vote: Vote): Promise<PopulatedTransaction> => {
  const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
  const data = lyraGovernanceV2Contract.interface.encodeFunctionData('submitVote', [
    proposalId,
    vote === Vote.For ? true : false,
  ])
  const tx = buildTx(
    mainnetProvider,
    isMainnet() ? NETWORK_CONFIGS[AppChain.Ethereum].chainId : NETWORK_CONFIGS[AppChain.EthereumGoerli].chainId,
    lyraGovernanceV2Contract.address,
    account,
    data
  )
  return tx
}
