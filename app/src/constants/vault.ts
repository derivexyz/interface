import {
  AccountBalances,
  AccountLiquidityTokenBalance,
  AccountLyraBalances,
  AccountRewardEpoch,
  AccountRewardEpochAPY,
  GlobalRewardEpoch,
  GlobalRewardEpochAPY,
  LiquidityDeposit,
  LiquidityWithdrawal,
  Market,
  MarketLiquiditySnapshot,
} from '@lyrafinance/lyra-js'

export type Vault = {
  market: Market
  marketLiquidity: MarketLiquiditySnapshot
  marketBalances: AccountBalances
  lyraBalances: AccountLyraBalances
  globalRewardEpoch: GlobalRewardEpoch | null
  accountRewardEpoch: AccountRewardEpoch | null
  tvl: number
  liquidityTokenBalanceValue: number
  liquidityToken: AccountLiquidityTokenBalance
  minApy: GlobalRewardEpochAPY
  maxApy: GlobalRewardEpochAPY
  apy: AccountRewardEpochAPY
  utilization: number
  pendingDeposits: LiquidityDeposit[]
  pendingWithdrawals: LiquidityWithdrawal[]
  allDeposits: LiquidityDeposit[]
  allWithdrawals: LiquidityWithdrawal[]
}
