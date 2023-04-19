import { AccountLyraBalances, AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import fetchENSNames from '@/app/utils/fetchENSNames'
import getLyraSDK from '@/app/utils/getLyraSDK'
import fetchTradingLeaderboard, { TradingRewardToken } from '@/app/utils/rewards/fetchTradingLeaderboard'

import { EMPTY_LYRA_BALANCES } from '../account/useAccountLyraBalances'
import useNetwork from '../account/useNetwork'
import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const ARBITRUM_OLD_REWARDS_EPOCHS = 5
const OPTIMISM_OLD_REWARDS_EPOCHS = 18

export type LeaderboardPageData = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  latestAccountRewardEpoch?: AccountRewardEpoch
  leaderboardEpochNumber: number
  leaderboard: TradingRewardsTrader[]
  lyraBalances: AccountLyraBalances
  currentTrader: TradingRewardsTrader | null
}

export type TradingRewardsTrader = {
  trader: string
  traderEns: string | null
  boost: number
  dailyReward: TradingRewardToken
  totalRewards: TradingRewardToken
}

export const fetchLeaderboardPageData = async (
  network: Network,
  walletAddress: string | null
): Promise<LeaderboardPageData> => {
  const lyra = getLyraSDK(network)
  const [globalRewardEpochs, accountRewardEpochs, lyraBalances] = await Promise.all([
    lyra.globalRewardEpochs(),
    walletAddress ? lyra.accountRewardEpochs(walletAddress) : [],
    walletAddress ? lyra.account(walletAddress).lyraBalances() : EMPTY_LYRA_BALANCES,
  ])
  const latestGlobalRewardEpoch =
    globalRewardEpochs.find(e => e.isCurrent) ??
    (globalRewardEpochs.length ? globalRewardEpochs.sort((a, b) => b.endTimestamp - a.endTimestamp)[0] : null)

  if (!latestGlobalRewardEpoch) {
    throw new Error('No global epochs for network')
  }

  const latestAccountRewardEpoch = accountRewardEpochs.find(
    e => e.globalEpoch.startTimestamp === latestGlobalRewardEpoch.startTimestamp
  )
  const tradingLeaderboard = await fetchTradingLeaderboard(network, latestGlobalRewardEpoch.startTimestamp)
  const traderAddresses = tradingLeaderboard ? Object.keys(tradingLeaderboard) : []
  const [accountENS, ...allENS] = await fetchENSNames([walletAddress ?? ZERO_ADDRESS, ...traderAddresses])
  const traderENSMap: Record<string, string | null> = {}
  allENS.forEach((ens, index) => {
    const traderAddress = traderAddresses[index]
    traderENSMap[traderAddress] = ens != '' ? ens : null
  })
  const leaderboard: TradingRewardsTrader[] = Object.entries(tradingLeaderboard ?? {}).map(([trader, traderStat]) => {
    const boost = traderStat.boost
    const dailyReward = traderStat.dailyRewards[0]
    const totalRewards = traderStat.totalRewards[0]

    return {
      trader,
      traderEns: traderENSMap[trader],
      boost,
      dailyReward: {
        ...totalRewards,
        amount: dailyReward.amount,
      },
      totalRewards,
    }
  })

  let currentTrader: TradingRewardsTrader | null = null
  leaderboard
    .sort((a, b) => b.dailyReward.amount - a.dailyReward.amount)
    .forEach(trader => {
      if (trader.trader.toLowerCase() === walletAddress?.toLowerCase()) {
        currentTrader = { ...trader }
      }
    })
  // Create default trader stats if leaderboard exists
  if (walletAddress && !currentTrader && leaderboard.length) {
    currentTrader = {
      trader: walletAddress,
      traderEns: accountENS !== '' ? accountENS : null,
      boost: 1,
      dailyReward: { ...leaderboard[0].dailyReward, amount: 0 },
      totalRewards: { ...leaderboard[0].dailyReward, amount: 0 },
    }
  }

  return {
    latestGlobalRewardEpoch,
    latestAccountRewardEpoch,
    leaderboardEpochNumber:
      network === Network.Arbitrum
        ? latestGlobalRewardEpoch.id - ARBITRUM_OLD_REWARDS_EPOCHS
        : latestGlobalRewardEpoch.id - OPTIMISM_OLD_REWARDS_EPOCHS,
    leaderboard,
    lyraBalances,
    currentTrader,
  }
}

export default function useLeaderboardPageData(network: Network | null): LeaderboardPageData | null {
  const account = useWalletAccount()
  const [leaderboardPageData] = useFetch(
    FetchId.LeaderboardPageData,
    network ? [network, account] : null,
    fetchLeaderboardPageData
  )
  return leaderboardPageData
}

export function useMutateLeaderboardPageData() {
  const { account } = useWallet()
  const network = useNetwork()
  const mutate = useMutate(FetchId.LeaderboardPageData, fetchLeaderboardPageData)
  return useCallback(() => (account ? mutate(network, account) : null), [account, mutate, network])
}
