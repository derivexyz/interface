export enum PageId {
  NotFound = 'NotFound',
  Admin = 'Admin',
  AdminBoard = 'AdminBoard',
  Trade = 'Trade',
  TradeIndex = 'TradeIndex',
  TradeHistory = 'TradeHistory',
  Position = 'Position',
  Leaderboard = 'Leaderboard',
  LeaderboardIndex = 'LeaderboardIndex',
  LeaderboardHistory = 'LeaderboardHistory',
  EarnIndex = 'EarnIndex',
  EarnTrading = 'EarnTrading',
  EarnVaults = 'EarnVaults',
  EarnEthLyraLp = 'EarnEthLyraLp',
  VoteIndex = 'VoteIndex',
  VoteProposalCreate = 'VoteProposalCreate',
  VoteProposalDetails = 'VoteProposalDetails',
  EarnArrakis = 'EarnArrakis',
  EarnReferrals = 'EarnReferrals',
  Storybook = 'Storybook',
  Faucet = 'Faucet',
}

export type PageArgsMap = {
  [PageId.NotFound]: undefined
  [PageId.Admin]: {
    network: string
    marketAddressOrName: string
  }
  [PageId.AdminBoard]: {
    network: string
    marketAddressOrName: string
    boardId: number
  }
  [PageId.Trade]: {
    network: string
    marketAddressOrName: string
  }
  [PageId.TradeIndex]: undefined
  [PageId.TradeHistory]: undefined
  [PageId.Position]: {
    marketAddressOrName: string
    network: string
    positionId: number
  }
  [PageId.Leaderboard]: {
    network: string
  }
  [PageId.LeaderboardIndex]: undefined
  [PageId.LeaderboardHistory]: undefined
  [PageId.EarnIndex]: undefined
  [PageId.EarnTrading]: {
    network: string
  }
  [PageId.EarnVaults]: {
    network: string
    marketAddressOrName: string
  }
  [PageId.EarnEthLyraLp]: undefined
  [PageId.VoteIndex]: undefined
  [PageId.VoteProposalCreate]: undefined
  [PageId.VoteProposalDetails]: {
    proposalId: number
  }
  [PageId.EarnArrakis]: undefined
  [PageId.EarnReferrals]: {
    network: string
  }
  [PageId.Storybook]: undefined
  [PageId.Faucet]: undefined
}

type PageArgsWithPageMap<M extends Record<string, any>> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        page: Key
      }
    : {
        page: Key
      } & M[Key]
}
export type PagePathArgs<T extends PageId> = PageArgsWithPageMap<PageArgsMap>[T]
