import { BigNumber } from '@ethersproject/bignumber'

import formatNumber, { FormatNumberOptions } from './formatNumber'
import formatUSD from './formatUSD'
import fromBigNumber from './fromBigNumber'

export type FormatBalanceOptions = {
  showDollars?: boolean
} & FormatNumberOptions

// TODO: @dappbeast unify balance types in SDK
type Balance =
  | {
      symbol: string
      decimals: number
      amount: number | BigNumber
    }
  | {
      symbol: string
      decimals: number
      balance: number | BigNumber
    }

export default function formatBalance(balance: Balance, options?: FormatBalanceOptions) {
  const valRaw = 'balance' in balance ? balance.balance : balance.amount
  const val = BigNumber.isBigNumber(valRaw) ? fromBigNumber(valRaw, balance.decimals) : valRaw
  return `${options?.showDollars ? formatUSD(val, options) : formatNumber(val, options)} ${balance.symbol}`
}
