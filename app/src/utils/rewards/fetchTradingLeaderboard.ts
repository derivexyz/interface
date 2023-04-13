import { Network } from '@/app/constants/networks'

type DailyPoint = {
  points: number
  day: number
  fees: number
  premium: number
  size: number
  durationInSeconds: number
  startOfDayTimestamp: number
  endOfDayTimestamp: number
  stakingBoost: number
  tradingBoost: number
  referralBoost: number
}

type DailyPoints = {
  [startTimestamp: number]: DailyPoint
}

export type TradingRewardToken = {
  address: string
  symbol: string
  decimals: number
  amount: number
}

export type TradingRewardsLeaderboard = {
  [trader: string]: {
    points: {
      daily: DailyPoints
      trades: number
      fees: number
      premium: number
      size: number
      durationInSeconds: number
      averageBoost: number
      total: number
      totalPercent: number
    }
    tokens: TradingRewardToken[]
  }
}

const fetchTradingLeaderboard = async (network: Network): Promise<TradingRewardsLeaderboard | null> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/rewards/tradingLeaderboard?network=${network}`, {
    method: 'GET',
    mode: 'cors',
  })
  if (res.status !== 200) {
    return null
  }
  const data: TradingRewardsLeaderboard[] = await res.json()
  return data[0]
}

export default fetchTradingLeaderboard
