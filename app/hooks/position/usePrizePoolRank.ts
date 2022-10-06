import { CompetitionPool } from '@/app/constants/competition'

import useFetch from '../data/useFetch'
import { fetchTransfersSentToOptimism } from '../gql/hop/useHopTransfersToOptimism'
import useWalletAccount from '../wallet/useWalletAccount'
import { fetchLeaderboard, LeaderboardAccount } from './useLeaderboard'

type LeaderboardAccountWithRank = Partial<LeaderboardAccount> & {
  rank: number
}

const EMPTY_FILTER = {}

const fetchPrizePoolRank = async (account: string, poolStr: string): Promise<LeaderboardAccountWithRank | null> => {
  const pool = JSON.parse(poolStr)
  if (pool.isRandom) {
    const transfers = await fetchTransfersSentToOptimism(account, 0)
    const hasBridged = transfers ? transfers.length > 0 : false
    return {
      // Qualified -> rank > 0
      rank: hasBridged ? 1 : -1,
    }
  }
  const leaderboard = await fetchLeaderboard(JSON.stringify(pool.leaderboardFilter ?? EMPTY_FILTER))
  const idx = leaderboard.findIndex(leaderboardAccount => leaderboardAccount.account === account)
  return idx >= 0
    ? {
        ...leaderboard[idx],
        rank: idx + 1,
      }
    : null
}

export default function usePrizePoolRank(pool: CompetitionPool) {
  const account = useWalletAccount()
  const [data] = useFetch('PrizePoolRank', account ? [account, JSON.stringify(pool)] : null, fetchPrizePoolRank)
  return data
}
