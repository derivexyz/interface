import Lyra, {
  AccountBalances,
  AccountLiquidityTokenBalance,
  AccountRewardEpoch,
  AccountRewardEpochAPY,
  GlobalRewardEpoch,
  GlobalRewardEpochAPY,
  LiquidityDeposit,
  LiquidityWithdrawal,
  Market,
  MarketLiquiditySnapshot,
} from '@lyrafinance/lyra-js'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import fromBigNumber from '@/app/utils/fromBigNumber'

import { useLyraFetch, useLyraMutate } from '../data/useLyraFetch'
import useWallet from '../wallet/useWallet'

export type VaultBalance = {
  market: Market
  marketLiquidity: MarketLiquiditySnapshot
  marketBalances: AccountBalances
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

const EMPTY_APY: GlobalRewardEpochAPY | AccountRewardEpochAPY = {
  op: 0,
  lyra: 0,
  total: 0,
}

export const fetchVaultBalance = async (
  lyra: Lyra,
  marketAddress: string,
  walletAddress?: string
): Promise<VaultBalance> => {
  const market = await lyra.market(marketAddress)
  const account = lyra.account(walletAddress ?? ZERO_ADDRESS)

  const fetchAccountBalances = async () =>
    account ? account.marketBalances(marketAddress) : lyra.account(ZERO_ADDRESS).marketBalances(marketAddress)

  const [marketLiquidity, globalRewardEpoch, marketBalances, deposits, withdrawals] = await Promise.all([
    market.liquidity(),
    lyra.latestGlobalRewardEpoch(),
    fetchAccountBalances(),
    account.liquidityDeposits(marketAddress),
    account.liquidityWithdrawals(marketAddress),
  ])

  const pendingDeposits = deposits.filter(d => d.isPending)
  const pendingWithdrawals = withdrawals.filter(w => w.isPending)

  let accountRewardEpoch: AccountRewardEpoch | null = null
  if (walletAddress && globalRewardEpoch) {
    accountRewardEpoch = await globalRewardEpoch.accountRewardEpoch(walletAddress)
  }

  const minApy = globalRewardEpoch?.minVaultApy(marketAddress) ?? EMPTY_APY
  const maxApy = globalRewardEpoch?.maxVaultApy(marketAddress) ?? EMPTY_APY
  const apy = accountRewardEpoch?.vaultApy(marketAddress) ?? minApy

  const liquidityToken = marketBalances.liquidityToken

  const tvl = fromBigNumber(marketLiquidity.tvl)
  const liquidityTokenBalanceValue = fromBigNumber(marketLiquidity.tokenPrice) * fromBigNumber(liquidityToken.balance)

  const utilization = marketLiquidity.utilization

  return {
    market,
    marketLiquidity,
    marketBalances,
    globalRewardEpoch,
    accountRewardEpoch,
    tvl,
    liquidityTokenBalanceValue,
    liquidityToken,
    minApy,
    maxApy,
    apy,
    utilization,
    pendingDeposits,
    pendingWithdrawals,
    allDeposits: deposits,
    allWithdrawals: withdrawals,
  }
}

export default function useVaultBalance(market: Market): VaultBalance | null {
  const { account } = useWallet()
  const [vaultStats] = useLyraFetch('VaultBalance', market.lyra, [market.address, account], fetchVaultBalance)
  return vaultStats
}

export function useMutateVaultBalance(lyra: Lyra) {
  return useLyraMutate('VaultBalance', lyra, fetchVaultBalance)
}
