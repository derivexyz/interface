import {
  AccountBalances,
  AccountRewardEpoch,
  GlobalRewardEpoch,
  Market,
  Network,
  RewardEpochTokenAmount,
} from '@lyrafinance/lyra-js'

import { ONE_BN, UNIT, ZERO_ADDRESS, ZERO_BN } from '../constants/bn'
import { DEPRECATED_VAULTS_LIST } from '../constants/deprecated'
import { AppNetwork } from '../constants/networks'
import { Vault } from '../constants/vault'
import getAverageCostPerLPToken from '../hooks/vaults/getAverageCostPerLPToken'
import { LyraBalances } from './common/fetchLyraBalances'
import { getStkLyraBalanceForNetwork } from './common/getLyraBalanceForNetwork'
import fromBigNumber from './fromBigNumber'
import getEmptyMarketBalances from './getEmpyMarketBalances'
import getLyraSDK from './getLyraSDK'

const EMPTY_APY: RewardEpochTokenAmount[] = []

const fetchVault = async (
  network: Network,
  market: Market,
  balances: AccountBalances[],
  lyraBalances: LyraBalances,
  walletAddress?: string,
  latestGlobalRewardEpoch?: GlobalRewardEpoch,
  latestAccountRewardEpoch?: AccountRewardEpoch
): Promise<Vault> => {
  const lyra = getLyraSDK(network, market.lyra.version)
  const account = lyra.account(walletAddress ?? ZERO_ADDRESS)

  const [marketLiquidity, deposits, withdrawals] = await Promise.all([
    market.liquidity(),
    market.deposits(account.address),
    market.withdrawals(account.address),
  ])

  const isDeprecated = DEPRECATED_VAULTS_LIST.some(
    ({ version, chain }) => version === lyra.version && chain === market.lyra.chain
  )

  const marketBalances =
    balances.find(balance => balance.market.isEqual(market.address)) ?? getEmptyMarketBalances(ZERO_ADDRESS, market)

  const pendingDeposits = deposits.filter(d => d.isPending)
  const pendingWithdrawals = withdrawals.filter(w => w.isPending)

  const minApy = latestGlobalRewardEpoch?.minVaultApy(market.address) ?? EMPTY_APY
  const maxApy = latestGlobalRewardEpoch?.maxVaultApy(market.address) ?? EMPTY_APY

  const stkLyraBalance = getStkLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
  const liquidityToken = marketBalances.liquidityToken
  const liquidityTokenBalance = fromBigNumber(liquidityToken.balance)

  const apy = latestGlobalRewardEpoch?.vaultApy(market.address, stkLyraBalance, liquidityTokenBalance) ?? minApy
  const apyMultiplier =
    latestGlobalRewardEpoch?.vaultApyMultiplier(market.address, stkLyraBalance, liquidityTokenBalance) ?? 1

  const tvl = fromBigNumber(marketLiquidity.tvl)
  const liquidityTokenBalanceValue = fromBigNumber(marketLiquidity.tokenPrice) * liquidityTokenBalance

  const utilization = marketLiquidity.utilization

  const avgCostPerToken = getAverageCostPerLPToken(deposits, withdrawals)
  const avgValue = avgCostPerToken.mul(liquidityToken.balance).div(UNIT)
  const pnl = liquidityTokenBalanceValue - fromBigNumber(avgValue)
  const pnlPercent =
    avgCostPerToken.gt(0) && pnl !== 0 ? marketLiquidity.tokenPrice.mul(UNIT).div(avgCostPerToken).sub(ONE_BN) : ZERO_BN

  return {
    market,
    marketLiquidity,
    marketBalances,
    lyraBalances,
    globalRewardEpoch: latestGlobalRewardEpoch ?? null,
    accountRewardEpoch: latestAccountRewardEpoch ?? null,
    tvl,
    liquidityTokenBalanceValue,
    liquidityToken,
    minApy,
    maxApy,
    apy,
    apyMultiplier,
    utilization,
    pendingDeposits,
    pendingWithdrawals,
    allDeposits: deposits,
    allWithdrawals: withdrawals,
    pnl,
    pnlPercentage: fromBigNumber(pnlPercent),
    isDeprecated,
  }
}

export default fetchVault
