export enum LogEvent {
  // Nav
  NavPortfolioTabClick = 'NavPortfolioTabClick',
  NavPortfolioAnnouncementCTAClick = 'NavPortfolioAnnouncementCTAClick',
  NavVaultsTabClick = 'NavVaultsTabClick',
  NavTradeTabClick = 'NavTradeTabClick',
  NavStakeTabClick = 'NavStakeTabClick',
  NavDocsClick = 'NavDocsClick',
  NavGithubClick = 'NavGithubClick',
  NavDiscordClick = 'NavDiscordClick',
  NavStatsClick = 'NavStatsClick',
  NavV1Click = 'NavV1Click',
  NavNetworkToggle = 'NavNetworkToggle',
  NavLightModeToggle = 'NavLightModeToggle',

  // Trade
  TradeApproveSubmit = 'TradeApproveSubmit',
  TradeApproveSuccess = 'TradeApproveSuccess',
  TradeApproveError = 'TradeApproveError',
  TradeSubmit = 'TradeSubmit',
  TradeSuccess = 'TradeSuccess',
  TradeError = 'TradeError',
  TradeCollateralUpdateSuccess = 'TradeCollateralUpdateSuccess',
  TradeCollateralExpand = 'TradeCollateralExpand',
  TradeCollateralCollapse = 'TradeCollateralCollapse',
  TradeCollateralInput = 'TradeCollateralInput',
  TradeCollateralSlide = 'TradeCollateralSlide',
  TradeSizeInput = 'TradeSizeInput',
  TradeCostExpand = 'TradeCostExpand',
  TradeCostCollapse = 'TradeCostCollapse',
  TradeCostWithSwapExpand = 'TradeCostWithSwapExpand',
  TradeCostWithSwapCollapse = 'TradeCostWithSwapCollapse',
  TradeToggleAdvancedMode = 'TradeToggleAdvancedMode',

  // Board
  BoardMarketSelect = 'BoardMarketSelect',
  BoardExpirySelect = 'BoardExpirySelect',
  BoardIsBuyToggle = 'BoardIsBuyToggle',
  BoardIsCallToggle = 'BoardIsCallToggle',
  BoardStrikeExpand = 'BoardStrikeExpand',
  BoardStrikeCollapse = 'BoardStrikeCollapse',
  BoardOptionSelect = 'BoardOptionSelect',
  BoardOptionDeselect = 'BoardOptionDeslect',
  BoardOptionDetailsClick = 'BoardOptionDetailsClick',
  BoardOpenPositionsExpand = 'BoardOpenPositionsExpand',
  BoardOpenPositionsCollapse = 'BoardOpenPositionsCollapse',

  // Chain
  ChainBoardExpand = 'ChainBoardExpand',
  ChainBoardCollapse = 'ChainBoardCollapse',

  // Portfolio
  PortfolioMarketClick = 'PortfolioMarketClick',

  // Vault
  VaultChartTypeSelect = 'VaultChartTypeSelect',
  VaultChartPeriodSelect = 'VaultChartPeriodSelect',
  VaultRewardsLearnMoreClick = 'VaultRewardsLearnMoreClick',
  VaultRisksLearnMoreClick = 'VaultRisksLearnMoreClick',
  VaultAboutLearnMoreClick = 'VaultAboutLearnMoreClick',

  // Staking
  StakeLyraApproveSubmit = 'StakeLyraApproveSubmit',
  StakeLyraApproveSuccess = 'StakeLyraApproveSuccess',
  StakeLyraApproveError = 'StakeLyraApproveError',
  StakeLyraModalOpen = 'StakeLyraModalOpen',
  StakeLyraModalClose = 'StakeLyraModalClose',
  StakeLyraSubmit = 'StakeLyraSubmit',
  StakeLyraSuccess = 'StakeLyraSuccess',
  StakeLyraError = 'StakeLyraError',
  UnstakeLyraSubmit = 'UnstakeLyraSubmit',
  UnstakeLyraSuccess = 'UnstakeLyraSuccess',
  UnstakeLyraError = 'UnstakeLyraError',
  StakeLyraOneInchClick = 'StakeLyraOneInchClick',

  // Onboarding
  OnboardingModalOpen = 'OnboardingModalOpen',
  OnboardingModalStepOneSuccessClick = 'OnboardingModalStepOneSuccessClick',
  OnboardingModalStepOneCancelClick = 'OnboardingModalStepOneCancelClick',
  OnboardingModalStepTwoSuccessClick = 'OnboardingModalStepTwoSuccessClick',
  OnboardingModalStepTwoCancelClick = 'OnboardingModalStepTwoCancelClick',

  // Misc
  ConnectWalletOpen = 'ConnectWalletModalOpen',
  ConnectWalletClose = 'ConnectWalletModalClose',
  // TODO: @dappbeast Track connect wallet submission
  ConnectWalletSuccess = 'ConnectWalletSuccess',
  ConnectWalletSwitchNetworkSubmit = 'ConnectWalletSwitchNetworkSubmit',
  ConnectWalletSwitchNetworkSuccess = 'ConnectWalletSwitchNetworkSuccess',

  // Pageview
  PageView = 'PageView',
}
