import { Network } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '../constants/bn'
import { ContractId, ContractMap } from '../constants/contracts'
import { AppNetwork } from '../constants/networks'
import { SECONDS_IN_YEAR } from '../constants/time'
import fetchTokenSpotPrice from './common/fetchTokenSpotPrice'
import getContract from './common/getContract'
import multicall, { MulticallRequest } from './common/multicall'
import fromBigNumber from './fromBigNumber'
import getTokenInfo from './getTokenInfo'

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

  const optimismToken = getTokenInfo('OP', Network.Optimism)
  const veloToken = getTokenInfo('VELO', Network.Optimism)
  const usdcToken = getTokenInfo('USDC', Network.Optimism)

  if (!optimismToken || !veloToken || !usdcToken) {
    console.warn('Missing token info in tokenlist.json')
    return {
      tvl: 0,
      apy: 0,
      valuePerLPToken: 0,
      lyraPerLPToken: 0,
      wethPerLPToken: 0,
      lpTokenBalance: 0,
    }
  }

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
        args: [veloToken.address],
      },
    ]),
    fetchTokenSpotPrice(optimismToken.address, AppNetwork.Optimism),
    fetchTokenSpotPrice(veloToken.address, AppNetwork.Optimism),
    address ? velodromeStakingPool.balanceOf(address) : ZERO_BN,
  ])
  const poolLyraBalance = fromBigNumber(poolLyraBalanceBN)
  const poolUsdcBalance = fromBigNumber(poolUsdcBalanceBN, usdcToken.decimals)
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
