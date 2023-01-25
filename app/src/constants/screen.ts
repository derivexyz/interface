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
  MigrateStakedLyra = 'MigrateStakedLyra',
  StakeLyra = 'StakeLyra',
  UnstakeLyra = 'UnstakeLyra',
  StakeWethLyra = 'StakeWethLyra',
  UnstakeWethLyra = 'UnstakeWethLyra',
  Admin = 'Admin',
}
