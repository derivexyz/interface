import { LYRA_OPTIMISM_MAINNET_ADDRESS, USDC_OPTIMISM_MAINNET_DECIMALS } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '../constants/bn'
import { ContractId, ContractMap } from '../constants/contracts'
import { AppNetwork } from '../constants/networks'
import { SECONDS_IN_YEAR } from '../constants/time'
import { VELO_OPTIMISM_MAINNET_ADDRESS } from '../constants/token'
import fetchTokenSpotPrice from './common/fetchTokenSpotPrice'
import getContract from './common/getContract'
import multicall, { MulticallRequest } from './common/multicall'
import fromBigNumber from './fromBigNumber'

export type VelodromeStaking = {
  tvl: number
  apy: number
  valuePerLPToken: number
  lyraPerLPToken: number
  wethPerLPToken: number
  lpTokenBalance: number
}

export default async function fetchVelodromeStaking(address: string | null): Promise<VelodromeStaking> {
  const velodromePool = getContract(ContractId.VelodromePool, AppNetwork.Optimism)
  const velodromeStakingPool = getContract(ContractId.VelodromeStaking, AppNetwork.Optimism)
  const [
    {
      returnData: [[totalSupplyBN], [poolLyraBalanceBN], [poolUsdcBalanceBN], [rewardRate]],
    },
    lyraPrice,
    veloPrice,
    stakedLPTokenBalance,
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<ContractMap[ContractId.VelodromePool], 'totalSupply'>,
        MulticallRequest<ContractMap[ContractId.VelodromePool], 'reserve0'>,
        MulticallRequest<ContractMap[ContractId.VelodromePool], 'reserve1'>,
        MulticallRequest<ContractMap[ContractId.VelodromeStaking], 'rewardRate'>
      ]
    >(AppNetwork.Optimism, [
      {
        contract: velodromePool,
        function: 'totalSupply',
        args: [],
      },
      {
        contract: velodromePool,
        function: 'reserve0',
        args: [],
      },
      {
        contract: velodromePool,
        function: 'reserve1',
        args: [],
      },
      {
        contract: velodromeStakingPool,
        function: 'rewardRate',
        args: [VELO_OPTIMISM_MAINNET_ADDRESS],
      },
    ]),
    fetchTokenSpotPrice(LYRA_OPTIMISM_MAINNET_ADDRESS, AppNetwork.Optimism),
    fetchTokenSpotPrice(VELO_OPTIMISM_MAINNET_ADDRESS, AppNetwork.Optimism),
    address ? velodromeStakingPool.balanceOf(address) : ZERO_BN,
  ])
  const poolLyraBalance = fromBigNumber(poolLyraBalanceBN)
  const poolUsdcBalance = fromBigNumber(poolUsdcBalanceBN, USDC_OPTIMISM_MAINNET_DECIMALS)
  const totalSupply = fromBigNumber(totalSupplyBN)
  const lyraPerLPToken = totalSupply > 0 ? poolLyraBalance / totalSupply : 0
  const usdcPerLPToken = totalSupply > 0 ? poolUsdcBalance / totalSupply : 0
  const tvl = poolLyraBalance * lyraPrice + poolUsdcBalance
  const valuePerLPToken = totalSupply > 0 ? tvl / totalSupply : 0
  const rewardsPerSecond = totalSupply > 0 ? fromBigNumber(rewardRate) / totalSupply : 0
  const apy = valuePerLPToken > 0 ? (rewardsPerSecond * SECONDS_IN_YEAR * veloPrice) / valuePerLPToken : 0
  return {
    tvl,
    apy,
    lyraPerLPToken,
    wethPerLPToken: usdcPerLPToken,
    valuePerLPToken,
    lpTokenBalance: fromBigNumber(stakedLPTokenBalance),
  }
}
