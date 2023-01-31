export enum FetchId {
  // pages
  VaultsTableData = 'VaultsTableData',
  AdminPageData = 'AdminPageData',

  // accounts
  AccountENS = 'AccountENS',
  AccountEthBalance = 'AccountEthBalance',
  AccountBalance = 'AccountBalance',
  AccountScreenTransaction = 'AccountScreenTransaction',

  // portfolio
  PortfolioPageData = 'PortfolioPageData',
  PortfolioMarketsTableData = 'PortfolioMarketsTableData',
  PortfolioOpenPositions = 'PortfolioOpenPositions',
  PortfolioUserProfitLossHistory = 'PortfolioUserProfitLossHistory',

  // trade
  TradePageData = 'TradePageData',
  TradeBalances = 'TradeBalances',

  // position
  PositionPageData = 'PositionPageData',
  PositionIVHistory = 'PositionIVHistory',
  PositionPriceHistory = 'PositionPriceHistory',

  // vaults
  VaultPageData = 'VaultPageData',
  VaultBalance = 'VaultBalance',
  VaultStats = 'VaultStats',
  VaultAggregateTVL = 'VaultAggregateTVL',
  VaultAggregateStats = 'VaultAggregateStats',

  // rewards
  // TODO: @dappbeast simplify account hooks
  Markets = 'Markets',
  AccountRewardEpochs = 'AccountRewardEpochs',
  LatestRewardEpoch = 'LatestRewardEpoch',
  Stake = 'Stake',
  Unstake = 'Unstake',
  LyraStaking = 'LyraStaking',
  LyraAccountStaking = 'LyraAccountStaking',
  WethLyraStaking = 'WethLyraStaking',
  AccountWethLyraStaking = 'AccountWethLyraStaking',
  ClaimableBalanceL2 = 'ClaimableBalanceL2',
  ClaimableBalanceL1 = 'ClaimableBalanceL1',

  // shared
  PositionHistory = 'PositionHistory',
  TradeHistory = 'TradeHistory',
  SpotPriceHistory = 'SpotPriceHistory',

  // admin
  AdminMultiSigTransaction = 'AdminMultiSigTransaction',
  AdminMultiSigTransactionCount = 'AdminMultiSigTransactionCount',
  AdminMultiSigTransactionIds = 'AdminMultiSigTransactionIds',
}
