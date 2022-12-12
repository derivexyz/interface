export enum PageId {
  NotFound = 'NotFound',
  Admin = 'Admin',
  AdminMarket = 'AdminMarket',
  AdminBoard = 'AdminBoard',
  Trade = 'Trade',
  Position = 'Position',
  Portfolio = 'Portfolio',
  History = 'History',
  Vaults = 'Vaults',
  VaultsIndex = 'VaultsIndex',
  VaultsHistory = 'VaultsHistory',
  Rewards = 'Rewards',
  RewardsHistory = 'RewardsHistory',
  Storybook = 'Storybook',
}

export type PageArgsMap = {
  [PageId.NotFound]: undefined
  [PageId.Admin]: undefined
  [PageId.AdminMarket]: { marketAddressOrName: string }
  [PageId.AdminBoard]: { marketAddressOrName: string; boardId: number }
  [PageId.Trade]: {
    marketAddressOrName: string
  }
  [PageId.Position]: {
    marketAddressOrName: string
    positionId: number
  }
  [PageId.Portfolio]: undefined
  [PageId.History]: undefined
  [PageId.VaultsIndex]: undefined
  [PageId.VaultsHistory]: undefined
  [PageId.Vaults]: {
    marketAddressOrName: string
  }
  [PageId.Rewards]: undefined
  [PageId.RewardsHistory]: undefined
  [PageId.Storybook]: undefined
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
