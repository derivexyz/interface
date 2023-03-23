import { BigNumber, PopulatedTransaction } from 'ethers'

import { AppNetwork } from '@/app/constants/networks'

import { ContractId } from '../../constants/contracts'
import buildTx from '../buildTx'
import getContract from '../common/getContract'
import mainnetProvider from '../mainnetProvider'

export function stakeArrakisLPToken(address: string, amount: BigNumber): PopulatedTransaction {
  const arrakisStakingRewardsContract = getContract(ContractId.ArrakisStakingRewards, AppNetwork.Ethereum)
  const calldata = arrakisStakingRewardsContract.interface.encodeFunctionData('stake', [amount])
  return buildTx(
    mainnetProvider,
    mainnetProvider.network.chainId,
    arrakisStakingRewardsContract.address,
    address,
    calldata
  )
}
