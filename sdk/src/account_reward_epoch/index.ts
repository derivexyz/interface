import { BigNumber, PopulatedTransaction } from 'ethers'
import { getAddress } from 'ethers/lib/utils'

import { AccountBalances, AccountLiquidityTokenBalance, AccountLyraBalances } from '../account'
import { ZERO_BN } from '../constants/bn'
import {
  Deployment,
  LYRA_ARBITRUM_MAINNET_ADDRESS,
  LYRA_OPTIMISM_KOVAN_ADDRESS,
  LYRA_OPTIMISM_MAINNET_ADDRESS,
  LyraGlobalContractId,
  NEW_STAKED_LYRA_ARBITRUM_ADDRESS,
  NEW_STAKED_LYRA_OPTIMISM_ADDRESS,
  OLD_STAKED_LYRA_OPTIMISM_ADDRESS,
  OP_OPTIMISM_MAINNET_ADDRESS,
} from '../constants/contracts'
import { LyraGlobalContractMap } from '../constants/mappings'
import { Network } from '../constants/network'
import { GlobalRewardEpoch } from '../global_reward_epoch'
import { RewardEpochTokenAmount } from '../global_reward_epoch'
import Lyra from '../lyra'
import buildTxWithGasEstimate from '../utils/buildTxWithGasEstimate'
import fetchAccountRewardEpochData, {
  AccountArrakisRewards,
  AccountRewardEpochData,
} from '../utils/fetchAccountRewardEpochData'
import fetchClaimAddedEvents from '../utils/fetchClaimAddedEvents'
import fetchClaimEvents from '../utils/fetchClaimEvents'
import findMarketX from '../utils/findMarketX'
import fromBigNumber from '../utils/fromBigNumber'
import getGlobalContract from '../utils/getGlobalContract'
import getUniqueRewardTokenAmounts from '../utils/getUniqueRewardTokenAmounts'
import multicall, { MulticallRequest } from '../utils/multicall'
import parseClaimAddedEvents from './parseClaimAddedEvents'

export type ClaimAddedEvent = {
  amount: BigNumber
  blockNumber: number
  claimer: string
  epochTimestamp: number
  rewardToken: string
  tag: string
  timestamp: number
}

export type ClaimEvent = {
  amount: BigNumber
  blockNumber: number
  claimer: string
  rewardToken: string
  timestamp: number
}

type ClaimableRewards = {
  vaultRewards: Record<string, RewardEpochTokenAmount[]>
  tradingRewards: RewardEpochTokenAmount[]
  stakingRewards: RewardEpochTokenAmount[]
  wethLyraRewards: RewardEpochTokenAmount[]
  totalRewards: RewardEpochTokenAmount[]
}

export class AccountRewardEpoch {
  lyra: Lyra
  account: string
  globalEpoch: GlobalRewardEpoch
  accountEpoch: AccountRewardEpochData
  stakedLyraBalance: number
  tradingFeeRebate: number
  tradingFees: number
  stakingRewards: RewardEpochTokenAmount[]
  isPendingRewards: boolean
  stakingRewardsUnlockTimestamp: RewardEpochTokenAmount[]
  totalVaultRewards: RewardEpochTokenAmount[]
  tradingRewards: RewardEpochTokenAmount[]
  shortCollateralRewards: RewardEpochTokenAmount[]
  wethLyraStakingL2: AccountArrakisRewards
  claimableRewards: ClaimableRewards
  totalClaimableVaultRewards: RewardEpochTokenAmount[]
  lyraBalances: AccountLyraBalances
  vaultTokenBalances: Record<string, AccountLiquidityTokenBalance>

  constructor(
    lyra: Lyra,
    account: string,
    accountEpoch: AccountRewardEpochData,
    globalEpoch: GlobalRewardEpoch,
    balances: AccountBalances[],
    lyraBalances: AccountLyraBalances,
    claimAddedEvents: ClaimAddedEvent[],
    claimableRewards: ClaimableRewards
  ) {
    this.lyra = lyra
    this.account = account
    this.globalEpoch = globalEpoch
    this.accountEpoch = accountEpoch
    this.lyraBalances = lyraBalances
    const avgStkLyraBalance =
      globalEpoch.progressDays > 0 ? accountEpoch.stakingRewards.stkLyraDays / globalEpoch.progressDays : 0
    this.stakedLyraBalance = globalEpoch.isComplete
      ? avgStkLyraBalance
      : fromBigNumber(lyraBalances.ethereumStkLyra.add(lyraBalances.optimismStkLyra))
    this.vaultTokenBalances = balances.reduce(
      (lpTokenBalances, balance) => ({
        ...lpTokenBalances,
        [balance.baseAsset.symbol]: balance.liquidityToken,
      }),
      {}
    )

    this.stakingRewards = accountEpoch.stakingRewards.rewards
    this.stakingRewardsUnlockTimestamp = accountEpoch.stakingRewards?.rewards?.map(token => {
      return {
        ...token,
        amount: globalEpoch.endTimestamp,
      }
    })

    const marketVaultRewards = globalEpoch.markets.map(market => this.vaultRewards(market.address)).flat()
    const marketVaultRewardsMap: { [tokenAddress: string]: RewardEpochTokenAmount } = {}
    marketVaultRewards.forEach(vaultReward => {
      if (!marketVaultRewardsMap[vaultReward.address]) {
        marketVaultRewardsMap[vaultReward.address] = vaultReward
      } else {
        marketVaultRewardsMap[vaultReward.address].amount += vaultReward.amount
      }
    })
    this.totalVaultRewards = Object.values(marketVaultRewardsMap)
    this.tradingFeeRebate = globalEpoch.tradingFeeRebate(this.stakedLyraBalance)
    const integratorTradingFees = accountEpoch.integratorTradingRewards?.fees ?? 0
    this.tradingFees = integratorTradingFees > 0 ? integratorTradingFees : accountEpoch.tradingRewards.fees
    this.tradingRewards = globalEpoch.tradingRewards(this.tradingFees, this.stakedLyraBalance)
    const integratorShortCollateralRewardDollars =
      this.accountEpoch.integratorTradingRewards?.shortCollateralRewardDollars ?? 0
    this.shortCollateralRewards = globalEpoch.shortCollateralRewards(
      integratorShortCollateralRewardDollars > 0
        ? integratorShortCollateralRewardDollars
        : this.accountEpoch.tradingRewards.shortCollateralRewardDollars
    )
    const claimAddedCurrEpoch = claimAddedEvents.filter(ev => ev.epochTimestamp === globalEpoch.startTimestamp)
    const claimableRewardsThisEpoch = parseClaimAddedEvents(claimAddedCurrEpoch, [], [globalEpoch])
    const isTradingPending = claimableRewardsThisEpoch.tradingRewards.some(
      rewardTokenAmount => rewardTokenAmount.amount > 0
    )
    const isVaultsPending = Object.values(claimableRewardsThisEpoch.vaultRewards)
      .flat()
      .some(rewardTokenAmount => rewardTokenAmount.amount > 0)
    this.isPendingRewards = !this.globalEpoch.isComplete && (isTradingPending || isVaultsPending)
    this.wethLyraStakingL2 = this.accountEpoch.arrakisRewards ?? {
      rewards: [],
      gUniTokensStaked: 0,
      percentShare: 0,
    }

    this.claimableRewards = claimableRewards
    this.totalClaimableVaultRewards = getUniqueRewardTokenAmounts(
      Object.values(this.claimableRewards.vaultRewards).flat()
    )
  }

  // Getters

  static async getByOwner(lyra: Lyra, address: string): Promise<AccountRewardEpoch[]> {
    if (lyra.deployment !== Deployment.Mainnet) {
      return []
    }
    const [accountEpochDatas, globalEpochs, lyraBalances, balances, _claimAddedEvents, claimEvents] = await Promise.all(
      [
        fetchAccountRewardEpochData(lyra, address),
        GlobalRewardEpoch.getAll(lyra),
        lyra.account(address).lyraBalances(),
        lyra.account(address).balances(),
        fetchClaimAddedEvents(lyra.chain, address),
        fetchClaimEvents(lyra.chain, address),
      ]
    )
    // HACK @michaelxuwu - Filter claimAdded mistake
    const claimAddedEvents = _claimAddedEvents.filter(
      event => event.rewardToken.toLowerCase() !== '0xCb9f85730f57732fc899fb158164b9Ed60c77D49'.toLowerCase()
    )
    // Get claimable rewards across all previous epochs
    const claimableRewards = parseClaimAddedEvents(claimAddedEvents, claimEvents, globalEpochs)
    return accountEpochDatas
      .map(accountEpochData => {
        const globalEpoch = globalEpochs.find(
          globalEpoch =>
            globalEpoch.startTimestamp === accountEpochData.startTimestamp &&
            globalEpoch.endTimestamp === accountEpochData.endTimestamp
        )
        if (!globalEpoch) {
          throw new Error('Missing corresponding global epoch for account epoch')
        }
        return new AccountRewardEpoch(
          lyra,
          address,
          accountEpochData,
          globalEpoch,
          balances,
          lyraBalances,
          claimAddedEvents,
          claimableRewards
        )
      })
      .sort((a, b) => a.globalEpoch.endTimestamp - b.globalEpoch.endTimestamp)
  }

  static async getByStartTimestamp(
    lyra: Lyra,
    address: string,
    startTimestamp: number
  ): Promise<AccountRewardEpoch | null> {
    if (lyra.deployment !== Deployment.Mainnet) {
      return null
    }
    const epochs = await AccountRewardEpoch.getByOwner(lyra, address)
    const epoch = epochs.find(epoch => epoch.globalEpoch.startTimestamp === startTimestamp)
    return epoch ?? null
  }

  static async getClaimableBalances(lyra: Lyra, address: string) {
    const distributorContract = getGlobalContract(lyra, LyraGlobalContractId.MultiDistributor)
    const newStkLyraAddress =
      lyra.network === Network.Arbitrum
        ? getAddress(NEW_STAKED_LYRA_ARBITRUM_ADDRESS)
        : getAddress(NEW_STAKED_LYRA_OPTIMISM_ADDRESS)
    const lyraAddress =
      lyra.network === Network.Arbitrum
        ? getAddress(LYRA_ARBITRUM_MAINNET_ADDRESS)
        : getAddress(LYRA_OPTIMISM_MAINNET_ADDRESS)
    const oldStkLyraAddress = getAddress(OLD_STAKED_LYRA_OPTIMISM_ADDRESS)
    const opAddress = lyra.deployment === Deployment.Mainnet ? OP_OPTIMISM_MAINNET_ADDRESS : LYRA_OPTIMISM_KOVAN_ADDRESS
    const {
      returnData: [newStkLyraClaimableBalance, oldStkLyraClaimableBalance, opClaimableBalance, lyraClaimableBalance],
    } = await multicall<
      [
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.MultiDistributor], 'claimableBalances'>,
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.MultiDistributor], 'claimableBalances'>,
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.MultiDistributor], 'claimableBalances'>,
        MulticallRequest<LyraGlobalContractMap[LyraGlobalContractId.MultiDistributor], 'claimableBalances'>
      ]
    >(lyra, [
      {
        contract: distributorContract,
        function: 'claimableBalances',
        args: [address, newStkLyraAddress],
      },
      {
        contract: distributorContract,
        function: 'claimableBalances',
        args: [address, oldStkLyraAddress],
      },
      {
        contract: distributorContract,
        function: 'claimableBalances',
        args: [address, opAddress],
      },
      {
        contract: distributorContract,
        function: 'claimableBalances',
        args: [address, lyraAddress],
      },
    ])
    return {
      newStkLyra: newStkLyraClaimableBalance ?? ZERO_BN,
      oldStkLyra: oldStkLyraClaimableBalance ?? ZERO_BN,
      op: opClaimableBalance ?? ZERO_BN,
      lyra: lyraClaimableBalance ?? ZERO_BN,
    }
  }

  static async claim(lyra: Lyra, address: string, tokenAddresses: string[]): Promise<PopulatedTransaction> {
    const distributorContract = getGlobalContract(lyra, LyraGlobalContractId.MultiDistributor)
    const calldata = distributorContract.interface.encodeFunctionData('claim', [tokenAddresses])
    return await buildTxWithGasEstimate(
      lyra.provider,
      lyra.provider.network.chainId,
      distributorContract.address,
      address,
      calldata
    )
  }

  // Dynamic Fields

  vaultApy(marketAddressOrName: string): RewardEpochTokenAmount[] {
    const vaultTokenBalance = this.vaultTokenBalance(marketAddressOrName)
    if (vaultTokenBalance === 0) {
      return this.globalEpoch.minVaultApy(marketAddressOrName)
    } else {
      return this.globalEpoch.vaultApy(marketAddressOrName, this.stakedLyraBalance, vaultTokenBalance)
    }
  }

  vaultMaxBoost(marketAddressOrName: string): number {
    const vaultTokenBalance = this.vaultTokenBalance(marketAddressOrName)
    if (vaultTokenBalance === 0) {
      return this.globalEpoch.vaultMaxBoost(marketAddressOrName, 0)
    } else {
      return this.globalEpoch.vaultMaxBoost(marketAddressOrName, vaultTokenBalance)
    }
  }

  vaultApyMultiplier(marketAddressOrName: string): number {
    const vaultTokenBalance = this.vaultTokenBalance(marketAddressOrName)
    if (vaultTokenBalance === 0) {
      return 1
    } else {
      return this.globalEpoch.vaultApyMultiplier(marketAddressOrName, this.stakedLyraBalance, vaultTokenBalance)
    }
  }

  vaultTokenBalance(marketAddressOrName: string): number {
    const market = findMarketX(this.globalEpoch.markets, marketAddressOrName)
    const marketKey = market.baseToken.symbol
    const boostedLpDays: number = this.accountEpoch.mmvRewards
      ? this.accountEpoch.mmvRewards[marketKey]?.boostedLpDays ?? 0
      : 0
    const avgVaultTokenBalance = this.globalEpoch.progressDays > 0 ? boostedLpDays / this.globalEpoch.progressDays : 0
    const currVaultTokenBalance = fromBigNumber(this.vaultTokenBalances[marketKey].balance)
    // Uses average for historical epochs, realtime for current epoch
    const vaultTokenBalance = this.globalEpoch.isComplete ? avgVaultTokenBalance : currVaultTokenBalance
    return vaultTokenBalance
  }

  vaultRewards(marketAddressOrName: string): RewardEpochTokenAmount[] {
    const market = findMarketX(this.globalEpoch.markets, marketAddressOrName)
    const marketKey = market.baseToken.symbol
    const mmvRewards = this.accountEpoch.mmvRewards ? this.accountEpoch.mmvRewards[marketKey] : null
    if (!mmvRewards) {
      return []
    }
    const isIgnored = !!mmvRewards.isIgnored
    return mmvRewards.rewards.map(token => {
      const amount = isIgnored ? 0 : token.amount
      return {
        ...token,
        amount,
      }
    })
  }

  claimableVaultRewards(marketAddressOrName: string): RewardEpochTokenAmount[] {
    const market = findMarketX(this.globalEpoch.markets, marketAddressOrName)
    const marketKey = market.baseToken.symbol
    const claimableVaultRewards = this.claimableRewards.vaultRewards[marketKey]
    if (!claimableVaultRewards) {
      return this.globalEpoch.totalVaultRewards(market.address).map(t => ({ ...t, amount: 0 }))
    }
    return claimableVaultRewards
  }
}
