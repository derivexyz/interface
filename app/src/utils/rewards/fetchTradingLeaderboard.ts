import { Network } from '@/app/constants/networks'

export type TradingRewardToken = {
  address: string
  symbol: string
  decimals: number
  amount: number
}

export type TradingRewardsLeaderboard = {
  [trader: string]: {
    trader: string
    boost: number
    dailyRewards: TradingRewardToken[]
    totalRewards: TradingRewardToken[]
  }
}

const fetchTradingLeaderboard = async (
  network: Network,
  startTimestamp: number
): Promise<TradingRewardsLeaderboard | null> => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/rewards/tradingLeaderboard?network=${network}&startTimestamp=${startTimestamp}`,
    {
      method: 'GET',
      mode: 'cors',
    }
  )
  if (res.status !== 200) {
    return null
  }
  const data: TradingRewardsLeaderboard = await res.json()
  return data
}

export default fetchTradingLeaderboard
