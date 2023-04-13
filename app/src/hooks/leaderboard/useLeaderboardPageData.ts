import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchENSNames from '@/app/utils/fetchENSNames'
import getLyraSDK from '@/app/utils/getLyraSDK'
import fetchTradingLeaderboard, { TradingRewardToken } from '@/app/utils/rewards/fetchTradingLeaderboard'

import useNetwork from '../account/useNetwork'
import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

export type LeaderboardPageData = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  latestAccountRewardEpoch?: AccountRewardEpoch
  traders: TradingRewardsTraders
}

export type TradingRewardsTrader = {
  rank: number
  trader: string
  traderEns: string | null
  boost: number
  dailyReward: TradingRewardToken
  totalRewards: TradingRewardToken
}

export type TradingRewardsTraders = TradingRewardsTrader[]

export const fetchLeaderboardPageData = async (
  network: Network,
  walletAddress: string | null
): Promise<LeaderboardPageData> => {
  const [globalRewardEpochs, accountRewardEpochs, tradingLeaderboard] = await Promise.all([
    getLyraSDK(network).globalRewardEpochs(),
    walletAddress ? getLyraSDK(network).accountRewardEpochs(walletAddress) : [],
    fetchTradingLeaderboard(network),
  ])

  let latestGlobalRewardEpoch: GlobalRewardEpoch
  const currGlobalRewardEpoch = globalRewardEpochs.find(e => e.isCurrent)
  if (currGlobalRewardEpoch) {
    latestGlobalRewardEpoch = currGlobalRewardEpoch
  } else if (globalRewardEpochs.length > 0) {
    // If no current epoch is available, use latest epoch less than current timestamp
    latestGlobalRewardEpoch = globalRewardEpochs.sort((a, b) => b.endTimestamp - a.endTimestamp)[0]
  } else {
    throw new Error('No global epochs for network')
  }
  const latestAccountRewardEpoch = accountRewardEpochs.find(
    e => e.globalEpoch.startTimestamp === latestGlobalRewardEpoch.startTimestamp
  )

  const leaderboard = []
  const traders: TradingRewardsTraders = []
  const traderAddresses = tradingLeaderboard ? Object.keys(tradingLeaderboard) : []
  const allENS = await fetchENSNames(traderAddresses)
  const traderENSMap: Record<string, string | null> = {}
  allENS.forEach((ens, index) => {
    const traderAddress = traderAddresses[index]
    traderENSMap[traderAddress] = ens != '' ? ens : traderAddress
  })

  let currentTrader: TradingRewardsTrader | null = null
  for (const trader in tradingLeaderboard) {
    const traderStat = tradingLeaderboard[trader]
    const totalRewards = traderStat?.tokens[0]
    const totalPoints = traderStat.points.total
    const dailyRewards = Object.values(traderStat.points.daily).sort(
      (a, b) => b.startOfDayTimestamp - a.startOfDayTimestamp
    )
    const latestDaily = dailyRewards[0]
    const boost = Math.max(latestDaily.referralBoost, latestDaily.stakingBoost, latestDaily.tradingBoost)
    const dailyReward = totalPoints > 0 ? (latestDaily.points / totalPoints) * totalRewards.amount : 0
    leaderboard.push({
      trader: trader,
      traderEns: traderENSMap[trader],
      boost: boost,
      dailyReward: {
        ...totalRewards,
        amount: dailyReward,
      },
      totalRewards: totalRewards,
    })
  }
  leaderboard.sort((a, b) => b.totalRewards.amount - a.totalRewards.amount)
  leaderboard.forEach((trader, idx) => {
    const tradingRewardTrader = {
      rank: idx + 1,
      ...trader,
    }
    traders.push(tradingRewardTrader)
    if (trader.trader.toLowerCase() === walletAddress?.toLowerCase()) {
      currentTrader = tradingRewardTrader
    }
  })
  if (currentTrader) {
    traders.unshift(currentTrader)
  }
  return {
    latestGlobalRewardEpoch: latestGlobalRewardEpoch,
    latestAccountRewardEpoch: latestAccountRewardEpoch,
    traders: traders,
  }
}

export default function useLeaderboardPageData(): LeaderboardPageData | null {
  const account = useWalletAccount()
  const network = useNetwork()
  const [leaderboardPageData] = useFetch(FetchId.LeaderboardPageData, [network, account], fetchLeaderboardPageData)
  return leaderboardPageData
}

export function useMutateLeaderboardPageData() {
  const { account } = useWallet()
  const network = useNetwork()
  const mutate = useMutate(FetchId.LeaderboardPageData, fetchLeaderboardPageData)
  return useCallback(() => (account ? mutate(network, account) : null), [account, mutate, network])
}
