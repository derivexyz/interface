import { BigNumber } from 'ethers'

import { ContractId, ContractMap } from '../constants/contracts'
import { AppNetwork } from '../constants/networks'
import { SECONDS_IN_YEAR } from '../constants/time'
import { ERC20 } from '../contracts/typechain'
import fetchTokenSpotPrice from './common/fetchTokenSpotPrice'
import getContract from './common/getContract'
import getERC20Contract from './common/getERC20Contract'
import multicall, { MulticallRequest } from './common/multicall'
import fromBigNumber from './fromBigNumber'
import getTokenInfo from './getTokenInfo'

export type CamelotStaking = {
  tvl: number
  apy: number
  valuePerLPToken: number
  lyraPerLPToken: number
  wethPerLPToken: number
  lpTokenBalance: number
}

export default async function fetchCamelotStaking(address: string | null): Promise<CamelotStaking> {
  const lyraAddress = getTokenInfo('LYRA', AppNetwork.Arbitrum)?.address
  const wethAddress = getTokenInfo('WETH', AppNetwork.Arbitrum)?.address

  if (!lyraAddress || !wethAddress) {
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

  const lyra = getERC20Contract(AppNetwork.Arbitrum, lyraAddress)
  const weth = getERC20Contract(AppNetwork.Arbitrum, wethAddress)
  const camelotPool = getContract(ContractId.CamelotPool, AppNetwork.Arbitrum)
  const camelotNitroPool = getContract(ContractId.CamelotNitroPool, AppNetwork.Arbitrum)
  const [
    {
      returnData: [[totalSupplyBN], [poolLyraBalanceBN], [poolWethBalanceBN]],
    },
    nitroRewardsPerSecond,
    lyraPrice,
    wethPrice,
    userInfo,
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<ContractMap[ContractId.CamelotPool], 'totalSupply'>,
        MulticallRequest<ERC20, 'balanceOf'>,
        MulticallRequest<ERC20, 'balanceOf'>
      ]
    >(AppNetwork.Arbitrum, [
      {
        contract: camelotPool,
        function: 'totalSupply',
        args: [],
      },
      {
        contract: lyra,
        function: 'balanceOf',
        args: [camelotPool.address],
      },
      {
        contract: weth,
        function: 'balanceOf',
        args: [camelotPool.address],
      },
    ]),
    camelotNitroPool.rewardsToken1PerSecond(),
    fetchTokenSpotPrice(lyraAddress, AppNetwork.Arbitrum),
    fetchTokenSpotPrice(wethAddress, AppNetwork.Arbitrum),
    address ? camelotNitroPool.userInfo(address) : null,
  ])

  const poolLyraBalance = fromBigNumber(poolLyraBalanceBN)
  const poolWethBalance = fromBigNumber(poolWethBalanceBN)
  const totalSupply = fromBigNumber(totalSupplyBN)
  const lyraPerLPToken = totalSupply > 0 ? poolLyraBalance / totalSupply : 0
  const wethPerLPToken = totalSupply > 0 ? poolWethBalance / totalSupply : 0
  const tvl = poolLyraBalance * lyraPrice + poolWethBalance * wethPrice
  const valuePerLPToken = totalSupply > 0 ? tvl / totalSupply : 0
  const rewardsPerSecond = totalSupply > 0 ? fromBigNumber(BigNumber.from(nitroRewardsPerSecond)) / totalSupply : 0
  const apy = valuePerLPToken > 0 ? (rewardsPerSecond * SECONDS_IN_YEAR * lyraPrice) / valuePerLPToken : 0
  const lpTokenBalance = userInfo ? fromBigNumber(userInfo.totalDepositAmount) : 0
  return {
    tvl,
    apy,
    lyraPerLPToken,
    wethPerLPToken,
    valuePerLPToken,
    lpTokenBalance,
  }
}
