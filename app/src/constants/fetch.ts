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
  VaultBalance = 'VaultBalance',
  VaultStats = 'VaultStats',
  VaultAggregateTVL = 'VaultAggregateTVL',
  VaultAggregateStats = 'VaultAggregateStats',

  // rewards
  // TODO: @dappbeast simplify account hooks
  RewardsPageData = 'RewardsPageData',
  RewardsIndexPageData = 'RewardsIndexPageData',
  RewardsShortsPageData = 'RewardsShortsPageData',
  RewardsEthLyraLPPageData = 'RewardsEthLyraLPPageData',
  Markets = 'Markets',
  AccountRewardEpochs = 'AccountRewardEpochs',
  LatestRewardEpoch = 'LatestRewardEpoch',
  LyraStaking = 'LyraStaking',
  LyraStakingAccount = 'LyraStakingAccount',
  WethLyraStaking = 'WethLyraStaking',
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
