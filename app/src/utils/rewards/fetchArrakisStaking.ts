import { LYRA_ETHEREUM_MAINNET_ADDRESS, WETH_ETHEREUM_MAINNET_ADDRESS } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import { ZERO_BN } from '@/app/constants/bn'
import { ContractId, ContractMap } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import { SECONDS_IN_YEAR } from '@/app/constants/time'

import fetchTokenSpotPrice from '../common/fetchTokenSpotPrice'
import getContract from '../common/getContract'
import multicall, { MulticallRequest } from '../common/multicall'
import fromBigNumber from '../fromBigNumber'

export type ArrakisStaking = {
  stakedTokenBalance: BigNumber
  lpTokenValue: number
  wethPerToken: number
  lyraPerToken: number
  stakedTVL: number
  apy: number
  unstakedLPTokenBalance: BigNumber
  stakedLPTokenBalance: BigNumber
  rewards: BigNumber
  allowance: BigNumber
}

export default async function fetchArrakisStaking(address?: string | null): Promise<ArrakisStaking> {
  const arrakisVaultContract = getContract(ContractId.ArrakisPoolL1, AppNetwork.Ethereum)
  const arrakisStakingRewardsContract = getContract(ContractId.ArrakisStakingRewards, AppNetwork.Ethereum)
  const [
    {
      returnData: [[stakedTokenBalance], [amount0Current, amount1Current], [supplyBN], [rewardRate]],
    },
    lyraPrice,
    wethPrice,
    accountReturn,
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<ContractMap[ContractId.ArrakisPoolL1], 'balanceOf'>,
        MulticallRequest<ContractMap[ContractId.ArrakisPoolL1], 'getUnderlyingBalances'>,
        MulticallRequest<ContractMap[ContractId.ArrakisStakingRewards], 'totalSupply'>,
        MulticallRequest<ContractMap[ContractId.ArrakisStakingRewards], 'rewardRate'>
      ]
    >(AppNetwork.Ethereum, [
      {
        contract: arrakisVaultContract,
        function: 'balanceOf',
        args: [arrakisStakingRewardsContract.address],
      },
      {
        contract: arrakisVaultContract,
        function: 'getUnderlyingBalances',
        args: [],
      },
      {
        contract: arrakisStakingRewardsContract,
        function: 'totalSupply',
        args: [],
      },
      {
        contract: arrakisStakingRewardsContract,
        function: 'rewardRate',
        args: [],
      },
    ]),
    fetchTokenSpotPrice(LYRA_ETHEREUM_MAINNET_ADDRESS, AppNetwork.Ethereum),
    fetchTokenSpotPrice(WETH_ETHEREUM_MAINNET_ADDRESS, AppNetwork.Ethereum),
    address
      ? multicall<
          [
            MulticallRequest<ContractMap[ContractId.ArrakisPoolL1], 'balanceOf'>,
            MulticallRequest<ContractMap[ContractId.ArrakisPoolL1], 'allowance'>,
            MulticallRequest<ContractMap[ContractId.ArrakisStakingRewards], 'balanceOf'>,
            MulticallRequest<ContractMap[ContractId.ArrakisStakingRewards], 'earned'>
          ]
        >(AppNetwork.Ethereum, [
          {
            contract: arrakisVaultContract,
            function: 'balanceOf',
            args: [address],
          },
          {
            contract: arrakisVaultContract,
            function: 'allowance',
            args: [address, arrakisStakingRewardsContract.address],
          },
          {
            contract: arrakisStakingRewardsContract,
            function: 'balanceOf',
            args: [address],
          },
          {
            contract: arrakisStakingRewardsContract,
            function: 'earned',
            args: [address],
          },
        ])
      : null,
  ])

  let unstakedLPTokenBalance = ZERO_BN
  let allowance = ZERO_BN
  let stakedLPTokenBalance = ZERO_BN
  let rewards = ZERO_BN
  if (accountReturn) {
    const {
      returnData: [[_unstakedLPTokenBalance], [_allowance], [_stakedLPTokenBalance], [_rewards]],
    } = accountReturn
    unstakedLPTokenBalance = _unstakedLPTokenBalance
    allowance = _allowance
    stakedLPTokenBalance = _stakedLPTokenBalance
    rewards = _rewards
  }

  const poolLyraBalance = fromBigNumber(amount0Current)
  const poolwethBalance = fromBigNumber(amount1Current)
  const supply = fromBigNumber(supplyBN)
  const lyraPerToken = supply > 0 ? poolLyraBalance / supply : 0
  const wethPerToken = supply > 0 ? poolwethBalance / supply : 0
  const tvl = poolwethBalance * wethPrice + poolLyraBalance * lyraPrice
  const tokenValue = supply > 0 ? tvl / supply : 0
  const rewardsPerSecondPerToken = supply > 0 ? fromBigNumber(rewardRate) / supply : 0
  const apy = tokenValue > 0 ? (rewardsPerSecondPerToken * SECONDS_IN_YEAR * (lyraPrice ?? 0)) / tokenValue : 0
  return {
    lpTokenValue: tokenValue,
    stakedTokenBalance,
    apy,
    wethPerToken,
    lyraPerToken,
    stakedTVL: fromBigNumber(stakedTokenBalance) * tokenValue,
    unstakedLPTokenBalance,
    allowance,
    stakedLPTokenBalance,
    rewards,
  }
}
