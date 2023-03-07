export enum FetchId {
  // pages
  VaultsTableData = 'VaultsTableData',
  AdminPageData = 'AdminPageData',

  // accounts
  AccountENS = 'AccountENS',
  AccountEthBalance = 'AccountEthBalance',
  AccountScreenTransaction = 'AccountScreenTransaction',
  AccountBalances = 'AccountBalances',
  AccountLyraBalances = 'AccountLyraBalances',

  // portfolio
  PortfolioPageData = 'PortfolioPageData',
  PortfolioMarketsTableData = 'PortfolioMarketsTableData',
  PortfolioOpenPositions = 'PortfolioOpenPositions',
  PortfolioUserProfitLossHistory = 'PortfolioUserProfitLossHistory',

  // trade
  TradePageData = 'TradePageData',

  // position
  PositionPageData = 'PositionPageData',
  PositionIVHistory = 'PositionIVHistory',
  PositionPriceHistory = 'PositionPriceHistory',

  // vaults
  VaultPageData = 'VaultPageData',
  VaultStats = 'VaultStats',
  VaultAggregateTVL = 'VaultAggregateTVL',
  VaultAggregateStats = 'VaultAggregateStats',

  // faucet
  FaucetPageData = 'FaucetPageData',

  // rewards
  // TODO: @dappbeast simplify account hooks
  RewardsPageData = 'RewardsPageData',
  RewardsShortsPageData = 'RewardsShortsPageData',
  RewardsEthLyraLPPageData = 'RewardsEthLyraLPPageData',
  AccountRewardEpochs = 'AccountRewardEpochs',
  LatestRewardEpoch = 'LatestRewardEpoch',
  WethLyraStakingL2Account = 'WethLyraStakingL2Account',
  WethLyraStakingAccount = 'WethLyraStakingAccount',
  ClaimableBalanceL2 = 'ClaimableBalanceL2',
  ClaimableStakingRewards = 'ClaimableStakingRewards',
  ClaimableWethLyraRewards = 'ClaimableWethLyraRewards',
  TokenSupply = 'TokenSupply',
  NetworkTradingVolume = 'NetworkTradingVolume',

  // shared
  PositionHistory = 'PositionHistory',
  TradeHistory = 'TradeHistory',
  SpotPriceHistory = 'SpotPriceHistory',

  // admin
  AdminMultiSigTransaction = 'AdminMultiSigTransaction',
  AdminMultiSigTransactionCount = 'AdminMultiSigTransactionCount',
  AdminMultiSigTransactionIds = 'AdminMultiSigTransactionIds',
}
