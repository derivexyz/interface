export enum PageId {
  NotFound = 'NotFound',
  Admin = 'Admin',
  AdminBoard = 'AdminBoard',
  Trade = 'Trade',
  Position = 'Position',
  Portfolio = 'Portfolio',
  History = 'History',
  Vaults = 'Vaults',
  VaultsIndex = 'VaultsIndex',
  VaultsHistory = 'VaultsHistory',
  Leaderboard = 'Leaderboard',
  LeaderboardHistory = 'LeaderboardHistory',
  RewardsIndex = 'RewardsIndex',
  RewardsTrading = 'RewardsTrading',
  RewardsVaults = 'RewardsVaults',
  RewardsEthLyraLp = 'RewardsEthLyraLp',
  VoteIndex = 'VoteIndex',
  VoteProposalCreate = 'VoteProposalCreate',
  VoteProposalDetails = 'VoteProposalDetails',
  RewardsArrakis = 'RewardsArrakis',
  RewardsReferrals = 'RewardsReferrals',
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
  [PageId.Position]: {
    marketAddressOrName: string
    network: string
    positionId: number
  }
  [PageId.Portfolio]: undefined
  [PageId.History]: undefined
  [PageId.Leaderboard]: undefined
  [PageId.LeaderboardHistory]: undefined
  [PageId.VaultsIndex]: undefined
  [PageId.VaultsHistory]: undefined
  [PageId.Vaults]: {
    network: string
    marketAddressOrName: string
  }
  [PageId.RewardsIndex]: undefined
  [PageId.RewardsTrading]: {
    network: string
  }
  [PageId.RewardsVaults]: {
    network: string
    marketAddressOrName: string
  }
  [PageId.RewardsEthLyraLp]: undefined
  [PageId.VoteIndex]: undefined
  [PageId.VoteProposalCreate]: undefined
  [PageId.VoteProposalDetails]: {
    proposalId: number
  }
  [PageId.RewardsArrakis]: undefined
  [PageId.RewardsReferrals]: {
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
