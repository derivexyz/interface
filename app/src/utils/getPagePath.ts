import { PageArgsMap, PageId, PagePathArgs } from '../constants/pages'
import getHostname from './getHostname'

const getAdminPath = (args: PageArgsMap[PageId.Admin]): string => {
  return `/admin/${args.network}/${args.marketAddressOrName}`.toLowerCase()
}

const getAdminBoardPath = (args: PageArgsMap[PageId.AdminBoard]): string => {
  return `/admin/${args.network}/${args.marketAddressOrName}/${args.boardId}`.toLowerCase()
}

const getTradePath = (args: PageArgsMap[PageId.Trade]): string => {
  return `/trade/${args.network}/${args.marketAddressOrName}`.toLowerCase()
}

const getVaultPath = (args: PageArgsMap[PageId.Vaults]): string => {
  return `/vaults/${args.network}/${args.marketAddressOrName}`.toLowerCase()
}

const getPositionPath = (args: PageArgsMap[PageId.Position]): string => {
  return `/position/${args.network}/${args.marketAddressOrName}/${args.positionId}`.toLowerCase()
}

const getRewardsTradingPath = (args: PageArgsMap[PageId.RewardsTrading]): string => {
  return `/rewards/trading/${args.network}`.toLowerCase()
}

const getRewardsReferralsPath = (args: PageArgsMap[PageId.RewardsTrading]): string => {
  return `/rewards/referrals/${args.network}`.toLowerCase()
}

const getRewardsVaultsPath = (args: PageArgsMap[PageId.RewardsVaults]): string => {
  return `/rewards/vaults/${args.network}/${args.marketAddressOrName}`.toLowerCase()
}

const getVoteProposalDetailsPath = (args: PageArgsMap[PageId.VoteProposalDetails]): string => {
  return `/vote/proposal/${args.proposalId}`
}

const getLeaderboardPath = (args: PageArgsMap[PageId.Leaderboard]): string => {
  return `/leaderboard/${args.network}`
}

// TODO: @dappbeast Fix page path typescript in switch statement
export const getRelativePagePath = <T extends keyof PageArgsMap>(args: PagePathArgs<T>): string => {
  const page = args.page as PageId
  switch (page) {
    case PageId.Admin:
      return getAdminPath(args as PageArgsMap[PageId.Admin])
    case PageId.AdminBoard:
      return getAdminBoardPath(args as PageArgsMap[PageId.AdminBoard])
    case PageId.Trade:
      return getTradePath(args as PageArgsMap[PageId.Trade])
    case PageId.Position:
      return getPositionPath(args as PageArgsMap[PageId.Position])
    case PageId.Portfolio:
      return '/portfolio'
    case PageId.History:
      return '/portfolio/history'
    case PageId.Storybook:
      return '/storybook'
    case PageId.Faucet:
      return '/faucet'
    case PageId.Leaderboard:
      return getLeaderboardPath(args as PageArgsMap[PageId.Leaderboard])
    case PageId.LeaderboardHistory:
      return '/leaderboard/history'
    case PageId.VaultsIndex:
      return '/vaults'
    case PageId.VaultsHistory:
      return '/vaults/history'
    case PageId.Vaults:
      return getVaultPath(args as PageArgsMap[PageId.Vaults])
    case PageId.RewardsIndex:
      return '/rewards'
    case PageId.RewardsTrading:
      return getRewardsTradingPath(args as PageArgsMap[PageId.RewardsTrading])
    case PageId.RewardsVaults:
      return getRewardsVaultsPath(args as PageArgsMap[PageId.RewardsVaults])
    case PageId.RewardsEthLyraLp:
      return '/rewards/eth-lyra'
    case PageId.VoteIndex:
      return '/vote'
    case PageId.VoteProposalCreate:
      return '/vote/proposal/create'
    case PageId.VoteProposalDetails:
      return getVoteProposalDetailsPath(args as PageArgsMap[PageId.VoteProposalDetails])
    case PageId.RewardsArrakis:
      return '/rewards/arrakis'
    case PageId.RewardsReferrals:
      return getRewardsReferralsPath(args as PageArgsMap[PageId.RewardsReferrals])
    case PageId.NotFound:
      return '/404'
  }
}

const getPagePath = <T extends keyof PageArgsMap>(args: PagePathArgs<T>, includeHost = false): string => {
  const path = getRelativePagePath(args).toLowerCase()
  return includeHost ? `${getHostname()}${path}` : path
}

export default getPagePath
