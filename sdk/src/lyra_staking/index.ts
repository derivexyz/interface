import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'

import { MAX_BN } from '../constants/bn'
import {
  LYRA_ETHEREUM_KOVAN_ADDRESS,
  LYRA_ETHEREUM_MAINNET_ADDRESS,
  LyraGlobalContractId,
  OLD_STAKED_LYRA_OPTIMISM_ADDRESS,
} from '../constants/contracts'
import Lyra, { Deployment } from '../lyra'
import buildTx from '../utils/buildTx'
import fetchLyraStakingParams, { LyraStakingParams } from '../utils/fetchLyraStakingParams'
import getERC20Contract from '../utils/getERC20Contract'
import getGlobalContract from '../utils/getGlobalContract'

export type LyraStakingAccount = {
  lyraStaking: LyraStaking
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
  cooldownPeriod: number
  unstakeWindow: number
  totalSupply: BigNumber

  constructor(lyra: Lyra, stakingParams: LyraStakingParams) {
    this.lyra = lyra
    this.cooldownPeriod = stakingParams.cooldownPeriod
    this.unstakeWindow = stakingParams.unstakeWindow
    this.totalSupply = stakingParams.totalSupply
  }

  // Getters

  static async get(lyra: Lyra): Promise<LyraStaking> {
    const stakingParams = await fetchLyraStakingParams(lyra)
    const stake = new LyraStaking(lyra, stakingParams)
    return stake
  }

  static async getByOwner(lyra: Lyra, address: string): Promise<LyraStakingAccount> {
    if (!lyra.ethereumProvider || !lyra.optimismProvider) {
      throw new Error('Ethereum and Optimism provider required.')
    }
    const lyraStakingModuleContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const [block, lyraStaking, accountCooldownBN] = await Promise.all([
      lyra.provider.getBlock('latest'),
      LyraStaking.get(lyra),
      lyraStakingModuleContract.stakersCooldowns(address),
    ])
    const accountCooldown = accountCooldownBN.toNumber()
    const cooldownStartTimestamp = accountCooldown > 0 ? accountCooldown : null
    const cooldownEndTimestamp = accountCooldown > 0 ? accountCooldown + lyraStaking.cooldownPeriod : null
    const unstakeWindowStartTimestamp = cooldownEndTimestamp
    const unstakeWindowEndTimestamp = unstakeWindowStartTimestamp
      ? unstakeWindowStartTimestamp + lyraStaking.unstakeWindow
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
      lyraStaking,
      isInUnstakeWindow,
      isInCooldown,
      unstakeWindowStartTimestamp,
      unstakeWindowEndTimestamp,
    }
  }

  // Transactions

  static approve(lyra: Lyra, address: string): PopulatedTransaction {
    const proxyContract = getGlobalContract(lyra, LyraGlobalContractId.LyraStakingModule, lyra.ethereumProvider)
    const lyraContract = getERC20Contract(
      lyra.ethereumProvider ?? lyra.provider,
      lyra.deployment === Deployment.Mainnet ? LYRA_ETHEREUM_MAINNET_ADDRESS : LYRA_ETHEREUM_KOVAN_ADDRESS
    )
    const data = lyraContract.interface.encodeFunctionData('approve', [proxyContract.address, MAX_BN])
    return buildTx(lyra.ethereumProvider ?? lyra.provider, 1, lyraContract.address, address, data)
  }

  static stake(lyra: Lyra, address: string, amount: BigNumber): PopulatedTransaction {
    const lyraStakingModuleProxyContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const txData = lyraStakingModuleProxyContract.interface.encodeFunctionData('stake', [address, amount])
    return buildTx(lyra.ethereumProvider ?? lyra.provider, 1, lyraStakingModuleProxyContract.address, address, txData)
  }

  static requestUnstake(lyra: Lyra, address: string): PopulatedTransaction {
    const lyraStakingModuleProxyContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const data = lyraStakingModuleProxyContract.interface.encodeFunctionData('cooldown')
    return buildTx(lyra.ethereumProvider ?? lyra.provider, 1, lyraStakingModuleProxyContract.address, address, data)
  }

  static unstake(lyra: Lyra, address: string, amount: BigNumber): PopulatedTransaction {
    const lyraStakingModuleProxyContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const txData = lyraStakingModuleProxyContract.interface.encodeFunctionData('redeem', [address, amount])
    return buildTx(lyra.ethereumProvider ?? lyra.provider, 1, lyraStakingModuleProxyContract.address, address, txData)
  }

  static async claim(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const lyraStakingModuleContract = getGlobalContract(
      lyra,
      LyraGlobalContractId.LyraStakingModule,
      lyra.ethereumProvider
    )
    const totalRewardsBalance = await lyraStakingModuleContract.getTotalRewardsBalance(address)
    const data = lyraStakingModuleContract.interface.encodeFunctionData('claimRewards', [address, totalRewardsBalance])
    return buildTx(lyra.ethereumProvider ?? lyra.provider, 1, lyraStakingModuleContract.address, address, data)
  }

  static approveMigrate(lyra: Lyra, address: string): PopulatedTransaction {
    const tokenMigratorContract = getGlobalContract(lyra, LyraGlobalContractId.TokenMigrator)
    const erc20 = getERC20Contract(lyra.provider, OLD_STAKED_LYRA_OPTIMISM_ADDRESS)
    const data = erc20.interface.encodeFunctionData('approve', [tokenMigratorContract.address, MAX_BN])
    return buildTx(lyra.provider, lyra.provider.network.chainId, erc20.address, address, data)
  }

  static async migrateStakedLyra(lyra: Lyra, address: string): Promise<PopulatedTransaction> {
    const account = lyra.account(address)
    const tokenMigratorContract = getGlobalContract(lyra, LyraGlobalContractId.TokenMigrator, lyra.optimismProvider)
    const { optimismOldStkLyra } = await account.lyraBalances()
    const data = tokenMigratorContract.interface.encodeFunctionData('swap', [optimismOldStkLyra])
    return buildTx(lyra.provider, lyra.provider.network.chainId, tokenMigratorContract.address, address, data)
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
