import { LyraGlobalContractId } from '../constants/contracts'
import { LyraGlobalContractMap } from '../constants/mappings'
import Lyra from '../lyra'
import getGlobalContract from '../utils/getGlobalContract'
import multicall, { MulticallRequest } from '../utils/multicall'
import toBigNumber from '../utils/toBigNumber'
import { AccountWethLyraStaking, AccountWethLyraStakingL2 } from '../weth_lyra_staking'

export async function fetchAccountWethLyraStaking(lyra: Lyra, address: string): Promise<AccountWethLyraStaking> {
  const arrakisPoolL1Contract = getGlobalContract(lyra, LyraGlobalContractId.ArrakisPoolL1, lyra.ethereumProvider)
  const wethLyraStakingL1RewardsContract = getGlobalContract(
    lyra,
    LyraGlobalContractId.WethLyraStakingRewardsL1,
    lyra.ethereumProvider
  )
  const {
    returnData: [unstakedLPTokenBalance, allowance, stakedLPTokenBalance, rewards],
  } = await multicall<
    [
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.ArrakisPoolL1], 'balanceOf'>,
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.ArrakisPoolL1], 'allowance'>,
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.WethLyraStakingRewardsL1], 'balanceOf'>,
      MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.WethLyraStakingRewardsL1], 'earned'>
    ]
  >(
    lyra,
    [
      {
        contract: arrakisPoolL1Contract,
        function: 'balanceOf',
        args: [address],
      },
      {
        contract: arrakisPoolL1Contract,
        function: 'allowance',
        args: [address, wethLyraStakingL1RewardsContract.address],
      },
      {
        contract: wethLyraStakingL1RewardsContract,
        function: 'balanceOf',
        args: [address],
      },
      {
        contract: wethLyraStakingL1RewardsContract,
        function: 'earned',
        args: [address],
      },
    ],
    lyra.ethereumProvider
  )
  return {
    unstakedLPTokenBalance,
    allowance,
    stakedLPTokenBalance,
    rewards: rewards,
  }
}

export async function fetchAccountWethLyraStakingL2(lyra: Lyra, address: string): Promise<AccountWethLyraStakingL2> {
  const arrakisPoolL2Contract = getGlobalContract(lyra, LyraGlobalContractId.ArrakisPoolL2, lyra.optimismProvider)
  const wethLyraStakingL2RewardsContract = getGlobalContract(
    lyra,
    LyraGlobalContractId.WethLyraStakingRewardsL2,
    lyra.optimismProvider
  )

  const [
    {
      returnData: [unstakedLPTokenBalance, allowance, stakedLPTokenBalance, rewards],
    },
    latestGlobalRewardEpoch,
  ] = await Promise.all([
    multicall<
      [
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.ArrakisPoolL2], 'balanceOf'>,
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.ArrakisPoolL2], 'allowance'>,
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.WethLyraStakingRewardsL2], 'balanceOf'>,
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.WethLyraStakingRewardsL2], 'earned'>
      ]
    >(lyra, [
      {
        contract: arrakisPoolL2Contract,
        function: 'balanceOf',
        args: [address],
      },
      {
        contract: arrakisPoolL2Contract,
        function: 'allowance',
        args: [address, wethLyraStakingL2RewardsContract.address],
      },
      {
        contract: wethLyraStakingL2RewardsContract,
        function: 'balanceOf',
        args: [address],
      },
      {
        contract: wethLyraStakingL2RewardsContract,
        function: 'earned',
        args: [address],
      },
    ]),
    lyra.latestGlobalRewardEpoch(),
  ])

  const accountRewardEpoch = await latestGlobalRewardEpoch?.accountRewardEpoch(address)
  const opRewardsAmount =
    accountRewardEpoch?.wethLyraStakingL2?.rewards?.find(token => token.symbol.toLowerCase() === 'op')?.amount ?? 0
  const opRewards = toBigNumber(opRewardsAmount)
  return {
    unstakedLPTokenBalance,
    allowance,
    stakedLPTokenBalance,
    rewards,
    opRewards,
  }
}
