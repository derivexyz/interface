import { BigNumber } from '@ethersproject/bignumber'

import formatNumber, { FormatNumberOptions } from './formatNumber'
import formatUSD from './formatUSD'

export type FormatBalanceOptions = {
  showDollars?: boolean
} & FormatNumberOptions

export default function formatBalance(
  balance: number | BigNumber,
  tokenSymbol: string,
  options?: FormatBalanceOptions
) {
  return `${options?.showDollars ? formatUSD(balance, options) : formatNumber(balance, options)} ${tokenSymbol}`
}
