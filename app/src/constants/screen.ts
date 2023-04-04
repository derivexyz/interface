export type ScreenWalletData = {
  isBlocked: boolean
  blockReason: string | null
  blockDescription: string | null
}

export type ScreenWalletResponse = ScreenWalletData | { error: string }

export type ScreenTransactionData = {
  isBlocked: boolean
  blockReason: string | null
  blockDescription: string | null
}

export type ScreenTransactionResponse = ScreenTransactionData | { error: string }

export enum TransactionType {
  Faucet = 'Faucet',
  TradeOpenPosition = 'TradeOpenPosition',
  TradeClosePosition = 'TradeClosePosition',
  TradeCollateralUpdate = 'TradeCollateralUpdate',
  VaultDeposit = 'VaultDeposit',
  VaultWithdraw = 'VaultWithdraw',
  ClaimRewards = 'ClaimRewards',
  ClaimStakedLyraRewards = 'ClaimStakedLyraRewards',
  ClaimArrakisRewards = 'ClaimArrakisRewards',
  MigrateStakedLyra = 'MigrateStakedLyra',
  StakeLyra = 'StakeLyra',
  UnstakeLyra = 'UnstakeLyra',
  StakeArrakisLPToken = 'StakeArrakisLPToken',
  UnstakeArrakisOpLPToken = 'UnstakeArrakisOpLPToken',
  UnstakeArrakisLPToken = 'UnstakeArrakisLPToken',
  Admin = 'Admin',
  CreateProposal = 'CreateProposal',
  VoteProposal = 'VoteProposal',
  QueueProposal = 'QueueProposal',
  ExecuteProposal = 'ExecuteProposal',
}
