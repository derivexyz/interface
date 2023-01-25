import {
  AccountLyraBalances,
  AccountRewardEpoch,
  AccountRewardEpochAPY,
  GlobalRewardEpochAPY,
  Network,
} from '@lyrafinance/lyra-js'

import { ZERO_ADDRESS, ZERO_BN } from '../constants/bn'
import { Vault } from '../constants/vault'
import fromBigNumber from './fromBigNumber'
import getEmptyMarketBalances from './getEmpyMarketBalances'
import getLyraSDK from './getLyraSDK'

const EMPTY_APY: GlobalRewardEpochAPY | AccountRewardEpochAPY = {
  op: 0,
  lyra: 0,
  total: 0,
}

const EMPTY_LYRA_BALANCE: AccountLyraBalances = {
  ethereumLyra: ZERO_BN,
  optimismLyra: ZERO_BN,
  optimismOldStkLyra: ZERO_BN,
  ethereumStkLyra: ZERO_BN,
  optimismStkLyra: ZERO_BN,
}

const fetchVault = async (network: Network, marketAddressOrName: string, walletAddress?: string): Promise<Vault> => {
  const lyra = getLyraSDK(network)
  const market = await lyra.market(marketAddressOrName)
  const account = lyra.account(walletAddress ?? ZERO_ADDRESS)

  const fetchAccountBalances = async () =>
    account ? account.marketBalances(marketAddressOrName) : getEmptyMarketBalances(ZERO_ADDRESS, market)

  const fetchLyraBalances = async () => (account ? account.lyraBalances() : EMPTY_LYRA_BALANCE)

  const [marketLiquidity, globalRewardEpoch, marketBalances, lyraBalances, deposits, withdrawals] = await Promise.all([
    market.liquidity(),
    lyra.latestGlobalRewardEpoch(),
    fetchAccountBalances(),
    fetchLyraBalances(),
    account.liquidityDeposits(marketAddressOrName),
    account.liquidityWithdrawals(marketAddressOrName),
  ])

  const pendingDeposits = deposits.filter(d => d.isPending)
  const pendingWithdrawals = withdrawals.filter(w => w.isPending)

  let accountRewardEpoch: AccountRewardEpoch | null = null
  if (walletAddress && globalRewardEpoch) {
    accountRewardEpoch = await globalRewardEpoch.accountRewardEpoch(walletAddress)
  }

  const minApy = globalRewardEpoch?.minVaultApy(marketAddressOrName) ?? EMPTY_APY
  const maxApy = globalRewardEpoch?.maxVaultApy(marketAddressOrName) ?? EMPTY_APY
  const apy = accountRewardEpoch?.vaultApy(marketAddressOrName) ?? minApy

  const liquidityToken = marketBalances.liquidityToken

  const tvl = fromBigNumber(marketLiquidity.tvl)
  const liquidityTokenBalanceValue = fromBigNumber(marketLiquidity.tokenPrice) * fromBigNumber(liquidityToken.balance)

  const utilization = marketLiquidity.utilization

  return {
    market,
    marketLiquidity,
    marketBalances,
    lyraBalances,
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

export default fetchVault
