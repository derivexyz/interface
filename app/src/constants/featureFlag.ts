import { TransactionType } from './screen'

export enum FeatureFlag {
  DisableTransactions = 'DisableTransactions',
}

export type FeatureFlags = {
  [FeatureFlag.DisableTransactions]: Record<TransactionType, boolean>
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  [FeatureFlag.DisableTransactions]: {
    Faucet: false,
    TradeOpenPosition: false,
    TradeClosePosition: false,
    TradeCollateralUpdate: false,
    VaultDeposit: false,
    VaultWithdraw: false,
    ClaimRewards: false,
    StakeLyra: false,
    UnstakeLyra: false,
    StakeWethLyra: false,
    UnstakeWethLyra: false,
  },
}
