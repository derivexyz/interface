import { LiquidityDeposit, LiquidityWithdrawal } from '@lyrafinance/lyra-js'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

export type VaultHistory = {
  deposits: LiquidityDeposit[]
  withdrawals: LiquidityWithdrawal[]
}

const fetcher = async (owner: string): Promise<VaultHistory> => {
  const marketAddresses = await lyra.marketAddresses()
  const account = lyra.account(owner)
  const vaultHistory = await Promise.all(
    marketAddresses.map(async marketAddress => {
      const [deposits, withdrawals] = await Promise.all([
        account.liquidityDeposits(marketAddress),
        account.liquidityWithdrawals(marketAddress),
      ])
      return {
        deposits,
        withdrawals,
      }
    })
  )
  const deposits = vaultHistory.reduce((deposit, total) => {
    deposit = [...deposit, ...total.deposits]
    return deposit
  }, [] as LiquidityDeposit[])
  const withdrawals = vaultHistory.reduce((withdrawal, total) => {
    withdrawal = [...withdrawal, ...total.withdrawals]
    return withdrawal
  }, [] as LiquidityWithdrawal[])
  return {
    deposits,
    withdrawals,
  }
}

const EMPTY: VaultHistory = {
  deposits: [],
  withdrawals: [],
}

export default function useVaultsHistory(): VaultHistory {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  const [myVaultsLiquidity] = useFetch('VaultHistory', account ? [account] : null, fetcher)
  return myVaultsLiquidity ?? EMPTY
}
