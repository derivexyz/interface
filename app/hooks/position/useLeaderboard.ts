import { PositionLeaderboard, PositionLeaderboardFilter } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

export type LeaderboardAccount = {
  ensName: string | null
} & PositionLeaderboard

export const fetchLeaderboard = async (filterStr: string): Promise<LeaderboardAccount[]> => {
  const filter = JSON.parse(filterStr)
  const leaderboard = await lyra.leaderboard(filter)
  const addresses = leaderboard.map(({ account }) => account)
  // const ensNames = await fetchENSNames(addresses)

  return leaderboard.map((user, idx) => ({
    ...user,
    ensName: null,
    // ensName: ensNames[idx] ?? null,
  }))
}

const EMPTY: LeaderboardAccount[] = []
const EMPTY_FILTER = {}

export default function useLeaderboard(filter?: PositionLeaderboardFilter): LeaderboardAccount[] {
  const [leaderboard] = useFetch('Leaderboard', [JSON.stringify(filter ?? EMPTY_FILTER)], fetchLeaderboard)
  return leaderboard ?? EMPTY
}
