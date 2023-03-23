import { PopulatedTransaction } from 'ethers'

import { AppNetwork } from '@/app/constants/networks'

import { MAX_BN } from '../../constants/bn'
import { ContractId } from '../../constants/contracts'
import buildTx from '../buildTx'
import getContract from '../common/getContract'
import mainnetProvider from '../mainnetProvider'

export default function approveArrakisLPTokenStaking(address: string): PopulatedTransaction {
  const arrakisPoolContract = getContract(ContractId.ArrakisPoolL1, AppNetwork.Ethereum)
  const arrakisStakingContract = getContract(ContractId.ArrakisStakingRewards, AppNetwork.Ethereum)
  const calldata = arrakisPoolContract.interface.encodeFunctionData('approve', [arrakisStakingContract.address, MAX_BN])
  return buildTx(mainnetProvider, mainnetProvider.network.chainId, arrakisPoolContract.address, address, calldata)
}
