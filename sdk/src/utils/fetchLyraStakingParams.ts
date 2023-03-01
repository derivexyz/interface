import { BigNumber } from 'ethers'

import Lyra, { LyraGlobalContractId } from '..'
import { LyraGlobalContractMap } from '../constants/mappings'
import getGlobalContract from './getGlobalContract'
import multicall, { MulticallRequest } from './multicall'

export type LyraStakingParams = {
  cooldownPeriod: number
  unstakeWindow: number
  totalSupply: BigNumber
}

export default async function fetchLyraStakingParams(lyra: Lyra): Promise<LyraStakingParams> {
  const lyraStakingModuleContract = getGlobalContract(
    lyra,
    LyraGlobalContractId.LyraStakingModule,
    lyra.ethereumProvider
  )
  const {
    returnData: [cooldownPeriod, unstakeWindow, totalSupply],
  } = await multicall<
    [
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.LyraStakingModule], 'COOLDOWN_SECONDS'>,
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.LyraStakingModule], 'UNSTAKE_WINDOW'>,
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.LyraStakingModule], 'totalSupply'>
    ]
  >(
    lyra,
    [
      {
        args: [],
        contract: lyraStakingModuleContract,
        function: 'COOLDOWN_SECONDS',
      },
      {
        args: [],
        contract: lyraStakingModuleContract,
        function: 'UNSTAKE_WINDOW',
      },
      {
        args: [],
        contract: lyraStakingModuleContract,
        function: 'totalSupply',
      },
    ],
    lyra.ethereumProvider
  )
  return {
    cooldownPeriod: cooldownPeriod.toNumber(),
    unstakeWindow: unstakeWindow.toNumber(),
    totalSupply,
  }
}
