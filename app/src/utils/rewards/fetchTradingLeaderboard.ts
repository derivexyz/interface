import { Network } from '@/app/constants/networks'

export type TradingRewardToken = {
  address: string
  symbol: string
  decimals: number
  amount: number
}

export type TradingRewardsData = {
  trader: string
  boost: number
  dailyRewards: TradingRewardToken[]
  dailyPoints: number
  totalRewards: TradingRewardToken[]
  totalPoints: number
}

const fetchTradingLeaderboard = async (
  network: Network,
  startTimestamp: number
): Promise<Record<string, TradingRewardsData>> => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/rewards/tradingLeaderboard?network=${network}&startTimestamp=${startTimestamp}`,
    {
      method: 'GET',
      mode: 'cors',
    }
  )
  if (res.status !== 200) {
    return {}
  }
  const data: Record<string, TradingRewardsData> = await res.json()
  return data
}

export default fetchTradingLeaderboard
