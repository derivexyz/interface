import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchLyraBalances, { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import fetchENSNames from '@/app/utils/fetchENSNames'
import getLyraSDK from '@/app/utils/getLyraSDK'
import fetchTradingLeaderboard, { TradingRewardToken } from '@/app/utils/rewards/fetchTradingLeaderboard'

import useNetwork from '../account/useNetwork'
import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const ARBITRUM_OLD_REWARDS_EPOCHS = 5
const OPTIMISM_OLD_REWARDS_EPOCHS = 18

const POINTS_MULTIPLIER = 100

export type LeaderboardPageData = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  latestAccountRewardEpoch?: AccountRewardEpoch
  leaderboardEpochNumber: number
  leaderboard: TradingRewardsTrader[]
  lyraBalances: LyraBalances
}

export type TradingRewardsTrader = {
  trader: string
  traderEns: string | null
  boost: number
  dailyReward: TradingRewardToken
  dailyPoints: number
  totalRewards: TradingRewardToken
  totalPoints: number
}

export const fetchLeaderboardPageData = async (
  network: Network,
  walletAddress: string | null
): Promise<LeaderboardPageData> => {
  const lyra = getLyraSDK(network)
  const [globalRewardEpochs, accountRewardEpochs, lyraBalances] = await Promise.all([
    lyra.globalRewardEpochs(),
    walletAddress ? lyra.accountRewardEpochs(walletAddress) : [],
    fetchLyraBalances(walletAddress),
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
  const allENS = await fetchENSNames(traderAddresses)
  const traderENSMap: Record<string, string | null> = {}
  allENS.forEach((ens, index) => {
    const traderAddress = traderAddresses[index]
    traderENSMap[traderAddress] = ens != '' ? ens : null
  })

  const emptyTradingRewardToken: TradingRewardToken = {
    ...latestGlobalRewardEpoch.tradingRewardsCap[0],
    amount: 0,
  }

  const leaderboard: TradingRewardsTrader[] = Object.entries(tradingLeaderboard ?? {})
    .map(([trader, traderStat]) => {
      const boost = traderStat.boost
      const dailyReward: TradingRewardToken = traderStat.dailyRewards
        ? traderStat.dailyRewards.length > 0
          ? traderStat.dailyRewards[0]
          : emptyTradingRewardToken
        : emptyTradingRewardToken
      const totalRewards = traderStat.totalRewards
        ? traderStat.totalRewards.length > 0
          ? traderStat?.totalRewards[0]
          : emptyTradingRewardToken
        : emptyTradingRewardToken

      const dailyPoints = traderStat.dailyPoints
      const totalPoints = traderStat.totalPoints

      return {
        trader,
        traderEns: traderENSMap[trader],
        boost,
        dailyReward: {
          ...totalRewards,
          amount: dailyReward?.amount ?? 0,
        },
        dailyPoints: !dailyPoints || isNaN(dailyPoints) ? 0 : dailyPoints * POINTS_MULTIPLIER,
        totalRewards,
        totalPoints: !totalPoints || isNaN(totalPoints) ? 0 : totalPoints * POINTS_MULTIPLIER,
      }
    })
    .sort((a, b) => b.dailyPoints - a.dailyPoints)

  return {
    latestGlobalRewardEpoch,
    latestAccountRewardEpoch,
    leaderboardEpochNumber:
      network === Network.Arbitrum
        ? latestGlobalRewardEpoch.id - ARBITRUM_OLD_REWARDS_EPOCHS
        : latestGlobalRewardEpoch.id - OPTIMISM_OLD_REWARDS_EPOCHS,
    leaderboard,
    lyraBalances,
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
