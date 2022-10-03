import { PositionLeaderboard, PositionLeaderboardFilter, PositionLeaderboardSortBy } from '@lyrafinance/lyra-js'

import { ONE_BN } from './bn'

export type CompetitionSeasonConfig = {
  season: number
  name: string
  startTimestamp: number
  endTimestamp: number
  pools: CompetitionPool[]
}

type RankKey = keyof Omit<PositionLeaderboard, 'positions' | 'account' | 'totalNotionalVolume' | 'totalPremiums'>

export type CompetitionPool = {
  name: string
  description: string
  rankKey: RankKey
  secondaryRankKey?: RankKey
  leaderboardFilter?: PositionLeaderboardFilter
  isRankedByPercentage?: boolean
  isRandom?: boolean
  prizes: {
    name: string
    rank: number | [number, number]
    prize: number
    winner?: string | string[]
  }[]
  totalPrizePool: number
}

export const COMPETITION_SEASONS_CONFIG: CompetitionSeasonConfig[] = [
  {
    season: 1,
    name: 'Trade The Merge',
    startTimestamp: 1662595200,
    endTimestamp: 1665126000,
    pools: [
      {
        name: 'Relative P&L',
        rankKey: 'realizedLongPnlPercentage',
        secondaryRankKey: 'unrealizedLongPnlPercentage',
        isRankedByPercentage: true,
        description:
          'Prize Pool 1 traders are ranked by relative profit / loss for longs only. This is your total profits on close or settlement for buying calls and puts.',
        leaderboardFilter: {
          minPositionIds: {
            eth: 4490,
            btc: 178,
          },
          minOpenTimestamp: 1662595200,
          maxCloseTimestamp: 1665126000,
          sortBy: PositionLeaderboardSortBy.RealizedLongPnlPercentage,
          secondarySortBy: PositionLeaderboardSortBy.UnrealizedLongPnlPercentage,
          minTotalPremiums: ONE_BN.mul(100),
        },
        totalPrizePool: 15000,
        prizes: [
          {
            name: '1st Place',
            rank: 1,
            prize: 2000,
          },
          {
            name: '2nd Place',
            rank: 2,
            prize: 1000,
          },

          {
            name: '3rd Place',
            rank: 3,
            prize: 500,
          },
          {
            name: '4th-10th',
            rank: [4, 10],
            prize: 250,
          },
          {
            name: '11th-25th',
            rank: [11, 25],
            prize: 150,
          },
          {
            name: '26th-100th',
            rank: [26, 100],
            prize: 100,
          },
        ],
      },
      {
        name: 'Absolute P&L',
        rankKey: 'realizedPnl',
        secondaryRankKey: 'unrealizedPnl',
        description:
          'Prize Pool 2 traders are ranked by absolute profit / loss. This is your total profits on close or settlement for longs and shorts.',
        leaderboardFilter: {
          minPositionIds: {
            eth: 4490,
            btc: 178,
          },
          minOpenTimestamp: 1662595200,
          maxCloseTimestamp: 1665126000,
          sortBy: PositionLeaderboardSortBy.RealizedPnl,
          secondarySortBy: PositionLeaderboardSortBy.UnrealizedPnl,
          minTotalPremiums: ONE_BN.mul(100),
        },
        totalPrizePool: 15000,
        prizes: [
          {
            name: '1st Place',
            rank: 1,
            prize: 5000,
          },
          {
            name: '2nd Place',
            rank: 2,
            prize: 3000,
          },

          {
            name: '3rd Place',
            rank: 3,
            prize: 2000,
          },
          {
            name: '4th Place',
            rank: 4,
            prize: 1500,
          },
          {
            name: '5th Place',
            rank: 5,
            prize: 1000,
          },
          {
            name: '6th-10th',
            rank: [6, 10],
            prize: 500,
          },
        ],
      },
      {
        name: 'Bridge Giveaway',
        rankKey: 'realizedLongPnlPercentage',
        secondaryRankKey: 'unrealizedLongPnlPercentage',
        isRandom: true,
        isRankedByPercentage: true,
        description:
          '5 random traders who bridge to Optimism via Hop Protocol will win 2k OP. To qualify you must be placed in the top 2k traders.',
        leaderboardFilter: {
          minPositionIds: {
            eth: 4490,
            btc: 178,
          },
          minOpenTimestamp: 1662595200,
          maxCloseTimestamp: 1665126000,
          sortBy: PositionLeaderboardSortBy.RealizedLongPnlPercentage,
          secondarySortBy: PositionLeaderboardSortBy.UnrealizedLongPnlPercentage,
          minTotalPremiums: ONE_BN.mul(100),
        },
        totalPrizePool: 10000,
        prizes: [
          {
            name: 'Giveaway #1',
            rank: 1,
            prize: 2000,
            winner: '0x0DAB8Ddaf5A33072080D8A4702e9dFCD385EDdcb',
          },
          {
            name: 'Giveaway #2',
            rank: 2,
            prize: 2000,
            winner: '0x79926C541D1f28f9a0ABc9C84592E31743Cd1997',
          },
          {
            name: 'Giveaway #3',
            rank: 3,
            prize: 2000,
          },
          {
            name: 'Giveaway #4',
            rank: 4,
            prize: 2000,
          },
          {
            name: 'Giveaway #5',
            rank: 5,
            prize: 2000,
          },
        ],
      },
    ],
  },
]

export const TRADING_COMP_PREMIUM_THRESHOLD = 100
