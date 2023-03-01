import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from 'ethers'

import Lyra, { LyraGlobalContractId } from '..'
import { fetchAccountWethLyraStaking, fetchAccountWethLyraStakingL2 } from '../account/fetchAccountWethLyraStaking'
import { MAX_BN, ZERO_BN } from '../constants/bn'
import buildTxWithGasEstimate from '../utils/buildTxWithGasEstimate'
import fetchWethLyraStakingData from '../utils/fetchWethLyraStakingData'
import fromBigNumber from '../utils/fromBigNumber'
import getGlobalContract from '../utils/getGlobalContract'

export type AccountWethLyraStakingL2 = {
  unstakedLPTokenBalance: BigNumber
  stakedLPTokenBalance: BigNumber
  rewards: BigNumber
  opRewards: BigNumber
  allowance: BigNumber
}

export type AccountWethLyraStaking = {
  unstakedLPTokenBalance: BigNumber
  stakedLPTokenBalance: BigNumber
  rewards: BigNumber
  allowance: BigNumber
}

export class WethLyraStaking {
  lyra: Lyra
  totalStaked: BigNumber
  stakedTokenBalance: BigNumber
  lpTokenValue: number
  wethPerToken: number
  lyraPerToken: number
  stakedTVL: number
  apy: number
  constructor(
    lyra: Lyra,
    lpTokenValue: number,
    stakedTokenBalance: BigNumber,
    apy: number,
    wethPerToken: number,
    lyraPerToken: number
  ) {
    this.lyra = lyra
    this.totalStaked = ZERO_BN
    this.lpTokenValue = lpTokenValue
    this.stakedTokenBalance = stakedTokenBalance
    this.stakedTVL = fromBigNumber(stakedTokenBalance) * lpTokenValue
    this.apy = apy
    this.wethPerToken = wethPerToken
    this.lyraPerToken = lyraPerToken
  }

  static async get(lyra: Lyra): Promise<WethLyraStaking> {
    const [arrakisVaultContract, arrakisRewardsContract, { apy, tokenValue, wethPerToken, lyraPerToken }] =
      await Promise.all([
        getGlobalContract(lyra, LyraGlobalContractId.ArrakisPoolL1, lyra.ethereumProvider),
        getGlobalContract(lyra, LyraGlobalContractId.WethLyraStakingRewardsL1, lyra.ethereumProvider),
        fetchWethLyraStakingData(lyra),
      ])
    const stakedTokenBalance = await arrakisVaultContract.balanceOf(arrakisRewardsContract.address)
    return new WethLyraStaking(lyra, tokenValue, stakedTokenBalance, apy, wethPerToken, lyraPerToken)
  }

  static async getByOwner(lyra: Lyra, address: string): Promise<AccountWethLyraStaking> {
    return await fetchAccountWethLyraStaking(lyra, address)
  }

  // DEPRECATED
  static async getByOwnerL2(lyra: Lyra, address: string): Promise<AccountWethLyraStakingL2> {
    return await fetchAccountWethLyraStakingL2(lyra, address)
  }

  // Transactions

  static async approve(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const arrakisPoolContract = getGlobalContract(lyra, LyraGlobalContractId.ArrakisPoolL1)
    const wethLyraStakingContract = getGlobalContract(lyra, LyraGlobalContractId.WethLyraStakingRewardsL1)
    const calldata = arrakisPoolContract.interface.encodeFunctionData('approve', [
      wethLyraStakingContract.address,
      MAX_BN,
    ])
    return await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      arrakisPoolContract.address,
      address,
      calldata
    )
  }

  static async stake(lyra: Lyra, address: string, amount: BigNumber): Promise<PopulatedTransaction> {
    const wethLyraStakingL1RewardsContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.WethLyraStakingRewardsL1,
      lyra.ethereumProvider
    )
    const calldata = wethLyraStakingL1RewardsContract.interface.encodeFunctionData('stake', [amount])
    return await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      wethLyraStakingL1RewardsContract.address,
      address,
      calldata
    )
  }

  static async unstake(lyra: Lyra, address: string, amount: BigNumber) {
    const wethLyraStakingL1RewardsContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.WethLyraStakingRewardsL1,
      lyra.ethereumProvider
    )
    const calldata = wethLyraStakingL1RewardsContract.interface.encodeFunctionData('withdraw', [amount])
    return await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      wethLyraStakingL1RewardsContract.address,
      address,
      calldata
    )
  }

  static async claimableRewards(lyra: Lyra, address: string): Promise<BigNumber> {
    const wethLyraStakingRewardsL1Contract = getGlobalContract(
      lyra,
      LyraGlobalContractId.WethLyraStakingRewardsL1,
      lyra.ethereumProvider
    )
    return await wethLyraStakingRewardsL1Contract.earned(address)
  }

  static async claim(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const wethLyraStakingL1RewardsContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.WethLyraStakingRewardsL1,
      lyra.ethereumProvider
    )
    const calldata = wethLyraStakingL1RewardsContract.interface.encodeFunctionData('getReward')
    return await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      wethLyraStakingL1RewardsContract.address,
      address,
      calldata
    )
  }

  // Deprecated L2 Arrakis program
  static async unstakeL2(lyra: Lyra, address: string, amount: BigNumber) {
    const wethLyraStakingL2RewardsContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.WethLyraStakingRewardsL2,
      lyra.optimismProvider
    )
    const calldata = wethLyraStakingL2RewardsContract.interface.encodeFunctionData('withdraw', [amount])
    return await buildTxWithGasEstimate(
      lyra.optimismProvider ?? lyra.provider,
      lyra.chainId,
      wethLyraStakingL2RewardsContract.address,
      address,
      calldata
    )
  }

  static async claimL2(lyra: Lyra, address: string) {
    const wethLyraStakingL2RewardsContract = getGlobalContract(lyra, LyraGlobalContractId.WethLyraStakingRewardsL2)
    const calldata = wethLyraStakingL2RewardsContract.interface.encodeFunctionData('getReward')
    return await buildTxWithGasEstimate(
      lyra.optimismProvider ?? lyra.provider,
      lyra.chainId,
      wethLyraStakingL2RewardsContract.address,
      address,
      calldata
    )
  }
}
