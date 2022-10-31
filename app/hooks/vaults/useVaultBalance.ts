import {
  AccountLiquidityTokenBalance,
  AccountRewardEpoch,
  AccountRewardEpochAPY,
  AccountRewardEpochTokens,
  LiquidityDeposit,
  LiquidityWithdrawal,
} from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'
import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'
import { fetchVault, Vault } from './useVault'

export type VaultBalance = {
  balance: AccountLiquidityTokenBalance
  deposits: LiquidityDeposit[]
  withdrawals: LiquidityWithdrawal[]
  accountRewardEpoch: AccountRewardEpoch | null
  vault: Vault
  myApy: AccountRewardEpochAPY
  myPnl: number
  myPnlPercent: number
  myApyMultiplier: number
  myRewards: AccountRewardEpochTokens
}

const EMPTY_VAULT_APY: AccountRewardEpochAPY = {
  total: 0,
  op: 0,
  lyra: 0,
}

export const fetchVaultBalance = async (owner: string, marketAddressOrName: string): Promise<VaultBalance> => {
  const vault = await fetchVault(marketAddressOrName)
  const { market, globalRewardEpoch } = vault
  const account = lyra.account(owner)
  const [liquidityBalance, liquidityDeposits, liquidityWithdrawals, accountRewardEpoch, { pnl, pnlPercent }] =
    await Promise.all([
      account.liquidityTokenBalance(market.address),
      account.liquidityDeposits(market.address),
      account.liquidityWithdrawals(market.address),
      globalRewardEpoch ? globalRewardEpoch.accountRewardEpoch(owner) : null,
      account.liquidityUnrealizedPnl(market.address),
    ])

  return {
    balance: liquidityBalance,
    deposits: liquidityDeposits.filter(d => d.isPending),
    withdrawals: liquidityWithdrawals.filter(w => w.isPending),
    vault,
    accountRewardEpoch,
    myPnl: fromBigNumber(pnl),
    myPnlPercent: fromBigNumber(pnlPercent),
    myApy: accountRewardEpoch
      ? accountRewardEpoch.vaultApy(marketAddressOrName)
      : globalRewardEpoch?.minVaultApy(marketAddressOrName) ?? EMPTY_VAULT_APY,
    myApyMultiplier: accountRewardEpoch ? accountRewardEpoch.vaultApyMultiplier(marketAddressOrName) : 1,
    myRewards: accountRewardEpoch ? accountRewardEpoch.vaultRewards(marketAddressOrName) : { lyra: 0, op: 0 },
  }
}

export default function useVaultBalance(marketAddressOrName: string): VaultBalance | null {
  const account = useWalletAccount()
  const [balance] = useFetch(
    'VaultBalance',
    account && marketAddressOrName ? [account, marketAddressOrName] : null,
    fetchVaultBalance
  )
  return balance
}

export const useMutateVaultBalance = () => {
  const account = useWalletAccount()
  const mutate = useMutate('VaultBalance', fetchVaultBalance)
  return useCallback(
    async (marketAddressOrName: string) => (account ? await mutate(account, marketAddressOrName) : null),
    [mutate, account]
  )
}
