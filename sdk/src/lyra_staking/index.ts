import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'

import { MAX_BN } from '../constants/bn'
import {
  LYRA_ETHEREUM_KOVAN_ADDRESS,
  LYRA_ETHEREUM_MAINNET_ADDRESS,
  LyraGlobalContractId,
  OLD_STAKED_LYRA_OPTIMISM_ADDRESS,
} from '../constants/contracts'
import { GlobalRewardEpoch } from '../global_reward_epoch'
import Lyra, { Deployment } from '../lyra'
import buildTxWithGasEstimate from '../utils/buildTxWithGasEstimate'
import fetchLyraStakingParams, { LyraStakingParams } from '../utils/fetchLyraStakingParams'
import getERC20Contract from '../utils/getERC20Contract'
import getGlobalContract from '../utils/getGlobalContract'

export type AccountLyraStaking = {
  stakingParams: LyraStakingParams
  isInUnstakeWindow: boolean
  isInCooldown: boolean
  unstakeWindowStartTimestamp: number | null
  unstakeWindowEndTimestamp: number | null
}

export enum UnstakeDisabledReason {
  NotInUnstakeWindow = 'NotInUnstakeWindow',
  InsufficientBalance = 'InsufficientBalance',
  ZeroAmount = 'ZeroAmount',
}

export enum StakeDisabledReason {
  InsufficientBalance = 'InsufficientBalance',
  InsufficientAllowance = 'InsufficientAllowance',
  ZeroAmount = 'ZeroAmount',
}

export class LyraStaking {
  lyra: Lyra
  globalRewardEpoch: GlobalRewardEpoch | null
  cooldownPeriod: number
  unstakeWindow: number
  totalSupply: BigNumber

  constructor(lyra: Lyra, stakingParams: LyraStakingParams, globalRewardEpoch: GlobalRewardEpoch | null) {
    this.lyra = lyra
    this.globalRewardEpoch = globalRewardEpoch
    this.cooldownPeriod = stakingParams.cooldownPeriod
    this.unstakeWindow = stakingParams.unstakeWindow
    this.totalSupply = stakingParams.totalSupply
  }

  // Getters

  static async get(lyra: Lyra): Promise<LyraStaking> {
    const [stakingParams, globalRewardEpoch] = await Promise.all([
      fetchLyraStakingParams(lyra),
      lyra.latestGlobalRewardEpoch(),
    ])
    const stake = new LyraStaking(lyra, stakingParams, globalRewardEpoch)
    return stake
  }

  static async getByOwner(lyra: Lyra, address: string): Promise<AccountLyraStaking> {
    if (!lyra.ethereumProvider || !lyra.optimismProvider) {
      throw new Error('Ethereum and Optimism provider required.')
    }
    const lyraStakingModuleContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const [block, stakingParams, accountCooldownBN] = await Promise.all([
      lyra.provider.getBlock('latest'),
      fetchLyraStakingParams(lyra),
      lyraStakingModuleContract.stakersCooldowns(address),
    ])
    const accountCooldown = accountCooldownBN.toNumber()
    const cooldownStartTimestamp = accountCooldown > 0 ? accountCooldown : null
    const cooldownEndTimestamp = accountCooldown > 0 ? accountCooldown + stakingParams.cooldownPeriod : null
    const unstakeWindowStartTimestamp = cooldownEndTimestamp
    const unstakeWindowEndTimestamp = unstakeWindowStartTimestamp
      ? unstakeWindowStartTimestamp + stakingParams.unstakeWindow
      : null
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
      stakingParams,
      isInUnstakeWindow,
      isInCooldown,
      unstakeWindowStartTimestamp,
      unstakeWindowEndTimestamp,
    }
  }

  // Transactions

  static async approve(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const proxyContract = getGlobalContract(lyra, LyraGlobalContractId.LyraStakingModule, lyra.ethereumProvider)
    const lyraContract = getERC20Contract(
      lyra.ethereumProvider ?? lyra.provider,
      lyra.deployment === Deployment.Mainnet ? LYRA_ETHEREUM_MAINNET_ADDRESS : LYRA_ETHEREUM_KOVAN_ADDRESS
    )
    const data = lyraContract.interface.encodeFunctionData('approve', [proxyContract.address, MAX_BN])
    return await buildTxWithGasEstimate(lyra.ethereumProvider ?? lyra.provider, 1, lyraContract.address, address, data)
  }

  static async stake(lyra: Lyra, address: string, amount: BigNumber) {
    const lyraStakingModuleProxyContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const txData = lyraStakingModuleProxyContract.interface.encodeFunctionData('stake', [address, amount])
    return await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      lyraStakingModuleProxyContract.address,
      address,
      txData
    )
  }

  static async requestUnstake(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const lyraStakingModuleProxyContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const data = lyraStakingModuleProxyContract.interface.encodeFunctionData('cooldown')
    const tx = await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      lyraStakingModuleProxyContract.address,
      address,
      data
    )
    return tx
  }

  static async unstake(lyra: Lyra, address: string, amount: BigNumber) {
    const lyraStakingModuleProxyContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const txData = lyraStakingModuleProxyContract.interface.encodeFunctionData('redeem', [address, amount])
    return await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      lyraStakingModuleProxyContract.address,
      address,
      txData
    )
  }

  static async claim(lyra: Lyra, address: string) {
    const lyraStakingModuleContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const totalRewardsBalance = await lyraStakingModuleContract.getTotalRewardsBalance(address)
    const data = lyraStakingModuleContract.interface.encodeFunctionData('claimRewards', [address, totalRewardsBalance])
    const tx = await buildTxWithGasEstimate(
      lyra.ethereumProvider ?? lyra.provider,
      1,
      lyraStakingModuleContract.address,
      address,
      data
    )
    return tx
  }

  static async approveMigrate(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const tokenMigratorContract = getGlobalContract(lyra, LyraGlobalContractId.TokenMigrator)
    const erc20 = getERC20Contract(lyra.provider, OLD_STAKED_LYRA_OPTIMISM_ADDRESS)
    const data = erc20.interface.encodeFunctionData('approve', [tokenMigratorContract.address, MAX_BN])
    const tx = await buildTxWithGasEstimate(lyra.provider, lyra.provider.network.chainId, erc20.address, address, data)
    return tx
  }

  static async migrateStakedLyra(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const account = lyra.account(address)
    const tokenMigratorContract = getGlobalContract(lyra, LyraGlobalContractId.TokenMigrator, lyra.optimismProvider)
    const { optimismOldStkLyra } = await account.lyraBalances()
    const data = tokenMigratorContract.interface.encodeFunctionData('swap', [optimismOldStkLyra])
    const tx = await buildTxWithGasEstimate(
      lyra.provider,
      lyra.provider.network.chainId,
      tokenMigratorContract.address,
      address,
      data
    )
    return tx
  }

  static async claimableRewards(lyra: Lyra, address: string): Promise<BigNumber> {
    const lyraStakingModuleContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    return await lyraStakingModuleContract.getTotalRewardsBalance(address)
  }
}
