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

const getPositionPath = (args: PageArgsMap[PageId.Position]): string => {
  return `/position/${args.network}/${args.marketAddressOrName}/${args.positionId}`.toLowerCase()
}

const getRewardsTradingPath = (args: PageArgsMap[PageId.EarnTrading]): string => {
  return `/earn/trading/${args.network}`.toLowerCase()
}

const getRewardsReferralsPath = (args: PageArgsMap[PageId.EarnTrading]): string => {
  return `/earn/referrals/${args.network}`.toLowerCase()
}

const getRewardsVaultsPath = (args: PageArgsMap[PageId.EarnVaults]): string => {
  return `/earn/vaults/${args.network}/${args.marketAddressOrName}`.toLowerCase()
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
    case PageId.TradeIndex:
      return '/trade'
    case PageId.TradeHistory:
      return '/trade/history'
    case PageId.Storybook:
      return '/storybook'
    case PageId.Faucet:
      return '/faucet'
    case PageId.Leaderboard:
      return getLeaderboardPath(args as PageArgsMap[PageId.Leaderboard])
    case PageId.LeaderboardIndex:
      return '/leaderboard'
    case PageId.LeaderboardHistory:
      return '/leaderboard/history'
    case PageId.EarnIndex:
      return '/earn'
    case PageId.EarnTrading:
      return getRewardsTradingPath(args as PageArgsMap[PageId.EarnTrading])
    case PageId.EarnVaults:
      return getRewardsVaultsPath(args as PageArgsMap[PageId.EarnVaults])
    case PageId.EarnEthLyraLp:
      return '/earn/eth-lyra'
    case PageId.VoteIndex:
      return '/vote'
    case PageId.VoteProposalCreate:
      return '/vote/proposal/create'
    case PageId.VoteProposalDetails:
      return getVoteProposalDetailsPath(args as PageArgsMap[PageId.VoteProposalDetails])
    case PageId.EarnArrakis:
      return '/earn/arrakis'
    case PageId.EarnReferrals:
      return getRewardsReferralsPath(args as PageArgsMap[PageId.EarnReferrals])
    case PageId.NotFound:
      return '/404'
  }
}

const getPagePath = <T extends keyof PageArgsMap>(args: PagePathArgs<T>, includeHost = false): string => {
  const path = getRelativePagePath(args).toLowerCase()
  return includeHost ? `${getHostname()}${path}` : path
}

export default getPagePath
