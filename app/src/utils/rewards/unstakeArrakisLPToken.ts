import { BigNumber } from 'ethers'

import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'

import buildTx from '../buildTx'
import getContract from '../common/getContract'
import mainnetProvider from '../mainnetProvider'

export function unstakeArrakisLPToken(address: string, amount: BigNumber) {
  const arrakisStakingRewardsContract = getContract(ContractId.ArrakisStakingRewards, AppNetwork.Ethereum)
  const calldata = arrakisStakingRewardsContract.interface.encodeFunctionData('withdraw', [amount])
  return buildTx(
    mainnetProvider,
    mainnetProvider.network.chainId,
    arrakisStakingRewardsContract.address,
    address,
    calldata
  )
}
