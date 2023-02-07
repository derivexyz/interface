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
  ClaimWethLyraRewards = 'ClaimWethLyraRewards',
  MigrateStakedLyra = 'MigrateStakedLyra',
  StakeLyra = 'StakeLyra',
  UnstakeLyra = 'UnstakeLyra',
  StakeWethLyraL1 = 'StakeWethLyraL1',
  UnstakeWethLyraL2 = 'UnstakeWethLyraL2',
  UnstakeWethLyraL1 = 'UnstakeWethLyraL1',
  Admin = 'Admin',
}
