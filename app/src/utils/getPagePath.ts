import { PageArgsMap, PageId, PagePathArgs } from '../constants/pages'
import getHostname from './getHostname'

const getAdminMarketPath = (args: PageArgsMap[PageId.AdminMarket]): string => {
  return `/admin/${args.marketAddressOrName}`.toLowerCase()
}

const getAdminBoardPath = (args: PageArgsMap[PageId.AdminBoard]): string => {
  return `/admin/${args.marketAddressOrName}/${args.boardId}`.toLowerCase()
}

const getTradePath = (args: PageArgsMap[PageId.Trade]): string => {
  return `/trade/${args.marketAddressOrName}`.toLowerCase()
}

const getVaultPath = (args: PageArgsMap[PageId.Vaults]): string => {
  return `/vaults/${args.marketAddressOrName}`.toLowerCase()
}

const getPositionPath = (args: PageArgsMap[PageId.Position]): string => {
  return `/position/${args.marketAddressOrName}/${args.positionId}`.toLowerCase()
}

// TODO: @dappbeast Fix page path typescript in switch statement
export const getRelativePagePath = <T extends keyof PageArgsMap>(args: PagePathArgs<T>): string => {
  const page = args.page as PageId
  switch (page) {
    case PageId.Admin:
      return '/admin'
    case PageId.AdminMarket:
      return getAdminMarketPath(args as PageArgsMap[PageId.AdminMarket])
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
    case PageId.VaultsIndex:
      return '/vaults'
    case PageId.VaultsHistory:
      return '/vaults/history'
    case PageId.Vaults:
      return getVaultPath(args as PageArgsMap[PageId.Vaults])
    case PageId.Rewards:
      return '/rewards'
    case PageId.RewardsHistory:
      return '/rewards/history'
    case PageId.NotFound:
      return '/404'
  }
}

const getPagePath = <T extends keyof PageArgsMap>(args: PagePathArgs<T>, includeHost = false): string => {
  const path = getRelativePagePath(args)
  return includeHost ? `${getHostname()}${path}` : path
}

export default getPagePath
