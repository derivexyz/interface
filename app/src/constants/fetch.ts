export enum FetchId {
  // pages
  VaultsTableData = 'VaultsTableData',
  AdminPageData = 'AdminPageData',

  // accounts
  AccountENS = 'AccountENS',
  AccountEthBalance = 'AccountEthBalance',
  AccountIsSmartContractWallet = 'AccountIsSmartContractWallet',
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
  RewardsArrakisPageData = 'RewardsArrakisPageData',
  AccountRewardEpochs = 'AccountRewardEpochs',
  LatestRewardEpoch = 'LatestRewardEpoch',
  ArrakisOptimismAccount = 'ArrakisOptimismAccount',
  ArrakisStaking = 'ArrakisStaking',
  ClaimableBalanceL2 = 'ClaimableBalanceL2',
  ClaimableStakingRewards = 'ClaimableStakingRewards',
  TokenSupply = 'TokenSupply',
  NetworkTradingVolume = 'NetworkTradingVolume',
  CamelotStaking = 'CamelotStaking',

  // shared
  PositionHistory = 'PositionHistory',
  TradeHistory = 'TradeHistory',
  SpotPriceHistory = 'SpotPriceHistory',

  // admin
  AdminMultiSigTransaction = 'AdminMultiSigTransaction',
  AdminMultiSigTransactionCount = 'AdminMultiSigTransactionCount',
  AdminMultiSigTransactionIds = 'AdminMultiSigTransactionIds',
}
