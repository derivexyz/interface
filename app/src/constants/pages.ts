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
  [PageId.AdminMarket]: {
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
  [PageId.VaultsIndex]: undefined
  [PageId.VaultsHistory]: undefined
  [PageId.Vaults]: {
    network: string
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
