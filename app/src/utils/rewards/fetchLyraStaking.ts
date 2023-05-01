import { BigNumber } from 'ethers'

import { ZERO_BN } from '@/app/constants/bn'
import { ContractId, ContractMap } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import { SECONDS_IN_YEAR } from '@/app/constants/time'

import fetchTokenSpotPrice from '../common/fetchTokenSpotPrice'
import getContract from '../common/getContract'
import getERC20Contract from '../common/getERC20Contract'
import multicall, { MulticallRequest } from '../common/multicall'
import fromBigNumber from '../fromBigNumber'
import getProvider from '../getProvider'
import getTokenInfo from '../getTokenInfo'
import toBigNumber from '../toBigNumber'

export type LyraStaking = {
  stakingAllowance: BigNumber
  lyraBalance: BigNumber
  cooldownPeriod: number
  unstakeWindow: number
  totalSupply: BigNumber
  tokenPrice: BigNumber
  claimableRewards: BigNumber
  apy: number
  isInUnstakeWindow: boolean
  isInCooldown: boolean
  unstakeWindowStartTimestamp: number | null
  unstakeWindowEndTimestamp: number | null
}

export default async function fetchLyraStaking(address?: string | null): Promise<LyraStaking> {
  const lyraStakingContract = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)
  const stakedLyraAddress = getTokenInfo('stkLYRA', AppNetwork.Ethereum)?.address ?? ''
  const lyraAddress = getTokenInfo('lyra', AppNetwork.Ethereum)?.address ?? ''
  const lyra = getERC20Contract(AppNetwork.Ethereum, lyraAddress)
  const [
    {
      returnData: [[cooldownPeriodBN], [unstakeWindowBN], [totalSupplyBN], [emissionsPerSecondBN]],
    },
    tokenPrice,
    block,
    accountCooldownBN,
    claimableRewardsBN,
    lyraBalance,
    stakingAllowanceBN,
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<ContractMap[ContractId.LyraStaking], 'COOLDOWN_SECONDS'>,
        MulticallRequest<ContractMap[ContractId.LyraStaking], 'UNSTAKE_WINDOW'>,
        MulticallRequest<ContractMap[ContractId.LyraStaking], 'totalSupply'>,
        MulticallRequest<ContractMap[ContractId.LyraStaking], 'assets'>
      ]
    >(AppNetwork.Ethereum, [
      {
        args: [],
        contract: lyraStakingContract,
        function: 'COOLDOWN_SECONDS',
      },
      {
        args: [],
        contract: lyraStakingContract,
        function: 'UNSTAKE_WINDOW',
      },
      {
        args: [],
        contract: lyraStakingContract,
        function: 'totalSupply',
      },
      {
        args: [stakedLyraAddress],
        contract: lyraStakingContract,
        function: 'assets',
      },
    ]),
    fetchTokenSpotPrice(lyraAddress, AppNetwork.Ethereum),
    getProvider(AppNetwork.Ethereum).getBlock('latest'),
    address ? lyraStakingContract.stakersCooldowns(address) : null,
    address ? lyraStakingContract.getTotalRewardsBalance(address) : ZERO_BN,
    address ? lyra.balanceOf(address) : ZERO_BN,
    address ? lyra.allowance(address, lyraStakingContract.address) : ZERO_BN,
  ])

  const totalSupply = fromBigNumber(totalSupplyBN)
  const tokenPerDollar = tokenPrice > 0 ? 1 / tokenPrice : 0
  const pctSharePerDollar = totalSupply > 0 ? tokenPerDollar / totalSupply : 0
  const emissionsPerSecond = fromBigNumber(emissionsPerSecondBN)
  const perDollarPerSecond = emissionsPerSecond * pctSharePerDollar
  const apy = perDollarPerSecond * tokenPrice * SECONDS_IN_YEAR
  const cooldownPeriod = cooldownPeriodBN.toNumber()
  const unstakeWindow = unstakeWindowBN.toNumber()
  const accountCooldown = accountCooldownBN?.toNumber() ?? 0
  const cooldownStartTimestamp = accountCooldown > 0 ? accountCooldown : null
  const cooldownEndTimestamp = accountCooldown > 0 ? accountCooldown + cooldownPeriod : null
  const unstakeWindowStartTimestamp = cooldownEndTimestamp
  const unstakeWindowEndTimestamp = unstakeWindowStartTimestamp ? unstakeWindowStartTimestamp + unstakeWindow : null
  const isInUnstakeWindow =
    !!unstakeWindowStartTimestamp &&
    !!unstakeWindowEndTimestamp &&
    block.timestamp >= unstakeWindowStartTimestamp &&
    block.timestamp <= unstakeWindowEndTimestamp
  const isInCooldown =
    !!cooldownStartTimestamp &&
    !!cooldownEndTimestamp &&
    block.timestamp >= cooldownStartTimestamp &&
    block.timestamp <= cooldownEndTimestamp

  return {
    cooldownPeriod,
    unstakeWindow,
    totalSupply: totalSupplyBN,
    tokenPrice: toBigNumber(tokenPrice),
    apy,
    isInUnstakeWindow,
    isInCooldown,
    claimableRewards: claimableRewardsBN,
    unstakeWindowStartTimestamp,
    unstakeWindowEndTimestamp,
    lyraBalance,
    stakingAllowance: stakingAllowanceBN,
  }
}
