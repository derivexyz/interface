import { BigNumber } from 'ethers'

import { AppNetwork } from '@/app/constants/networks'

import { ContractId, ContractMap } from '../../constants/contracts'
import getContract from '../common/getContract'
import multicall, { MulticallRequest } from '../common/multicall'

export type ArrakisOpStaking = {
  unstakedLPTokenBalance: BigNumber
  stakedLPTokenBalance: BigNumber
  rewards: BigNumber
  allowance: BigNumber
}

export default async function fetchArrakisOptimismStaking(address: string): Promise<ArrakisOpStaking> {
  const arrakisPoolL2Contract = getContract(ContractId.ArrakisPoolL2, AppNetwork.Optimism)
  const arrakisOpStakingRewardsContract = getContract(ContractId.ArrakisOpStakingRewards, AppNetwork.Optimism)
  const [
    {
      returnData: [[unstakedLPTokenBalance], [allowance], [stakedLPTokenBalance], [rewards]],
    },
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<ContractMap[ContractId.ArrakisPoolL2], 'balanceOf'>,
        MulticallRequest<ContractMap[ContractId.ArrakisPoolL2], 'allowance'>,
        MulticallRequest<ContractMap[ContractId.ArrakisOpStakingRewards], 'balanceOf'>,
        MulticallRequest<ContractMap[ContractId.ArrakisOpStakingRewards], 'earned'>
      ]
    >(AppNetwork.Optimism, [
      {
        contract: arrakisPoolL2Contract,
        function: 'balanceOf',
        args: [address],
      },
      {
        contract: arrakisPoolL2Contract,
        function: 'allowance',
        args: [address, arrakisOpStakingRewardsContract.address],
      },
      {
        contract: arrakisOpStakingRewardsContract,
        function: 'balanceOf',
        args: [address],
      },
      {
        contract: arrakisOpStakingRewardsContract,
        function: 'earned',
        args: [address],
      },
    ]),
  ])

  return {
    unstakedLPTokenBalance,
    allowance,
    stakedLPTokenBalance,
    rewards,
  }
}
