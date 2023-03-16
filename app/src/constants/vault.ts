import {
  AccountBalances,
  AccountLiquidityTokenBalance,
  AccountLyraBalances,
  AccountRewardEpoch,
  GlobalRewardEpoch,
  LiquidityDeposit,
  LiquidityWithdrawal,
  Market,
  MarketLiquiditySnapshot,
  RewardEpochTokenAmount,
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
  minApy: RewardEpochTokenAmount[]
  maxApy: RewardEpochTokenAmount[]
  apy: RewardEpochTokenAmount[]
  apyMultiplier: number
  utilization: number
  pendingDeposits: LiquidityDeposit[]
  pendingWithdrawals: LiquidityWithdrawal[]
  allDeposits: LiquidityDeposit[]
  allWithdrawals: LiquidityWithdrawal[]
  pnl: number
  pnlPercentage: number
}
