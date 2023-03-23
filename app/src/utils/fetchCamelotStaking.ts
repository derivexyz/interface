import { LYRA_ARBITRUM_MAINNET_ADDRESS, WETH_ARBITRUM_MAINNET_ADDRESS } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import { ContractId, ContractMap } from '../constants/contracts'
import { CAMELOT_API_URL } from '../constants/links'
import { AppNetwork } from '../constants/networks'
import { SECONDS_IN_YEAR } from '../constants/time'
import { ERC20 } from '../contracts/typechain'
import fetchTokenSpotPrice from './common/fetchTokenSpotPrice'
import getContract from './common/getContract'
import getERC20Contract from './common/getERC20Contract'
import multicall, { MulticallRequest } from './common/multicall'
import fromBigNumber from './fromBigNumber'

export type CamelotStaking = {
  tvl: number
  apy: number
  valuePerLPToken: number
  lyraPerLPToken: number
  wethPerLPToken: number
  lpTokenBalance: number
}

type CamelotNitroPoolData = {
  nftPool: string
  rewardsToken1: string
  rewardsToken1PerSecond: string
}

const fetchNitroPoolData = async (): Promise<CamelotNitroPoolData | null> => {
  const res = await fetch(new URL('/nitro-pools-data', CAMELOT_API_URL))
  const camelotNitroPool = getContract(ContractId.CamelotNitroPool, AppNetwork.Arbitrum)
  return ((await res.json()) as Record<string, CamelotNitroPoolData>)[camelotNitroPool.address] ?? null
}

export default async function fetchCamelotStaking(address: string | null): Promise<CamelotStaking> {
  const lyra = getERC20Contract(AppNetwork.Arbitrum, LYRA_ARBITRUM_MAINNET_ADDRESS)
  const weth = getERC20Contract(AppNetwork.Arbitrum, WETH_ARBITRUM_MAINNET_ADDRESS)
  const camelotPool = getContract(ContractId.CamelotPool, AppNetwork.Arbitrum)
  const camelotNitroPool = getContract(ContractId.CamelotNitroPool, AppNetwork.Arbitrum)
  const [
    {
      returnData: [[totalSupplyBN], [poolLyraBalanceBN], [poolWethBalanceBN]],
    },
    nitroPoolData,
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
    fetchNitroPoolData(),
    fetchTokenSpotPrice(LYRA_ARBITRUM_MAINNET_ADDRESS, AppNetwork.Arbitrum),
    fetchTokenSpotPrice(WETH_ARBITRUM_MAINNET_ADDRESS, AppNetwork.Arbitrum),
    address ? camelotNitroPool.userInfo(address) : null,
  ])

  const poolLyraBalance = fromBigNumber(poolLyraBalanceBN)
  const poolWethBalance = fromBigNumber(poolWethBalanceBN)
  const totalSupply = fromBigNumber(totalSupplyBN)
  const lyraPerLPToken = totalSupply > 0 ? poolLyraBalance / totalSupply : 0
  const wethPerLPToken = totalSupply > 0 ? poolWethBalance / totalSupply : 0
  const tvl = poolLyraBalance * lyraPrice + poolWethBalance * wethPrice
  const valuePerLPToken = totalSupply > 0 ? tvl / totalSupply : 0
  const rewardsPerSecond =
    totalSupply > 0 && nitroPoolData
      ? fromBigNumber(BigNumber.from(nitroPoolData?.rewardsToken1PerSecond)) / totalSupply
      : 0
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
