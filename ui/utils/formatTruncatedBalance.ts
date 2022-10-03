import { BigNumber } from '@ethersproject/bignumber'

import { FormatNumberOptions } from './formatNumber'
import formatTruncatedNumber from './formatTruncatedNumber'
import formatTruncatedUSD from './formatTruncatedUSD'

export type FormatTruncatedBalanceOptions = {
  showDollars?: boolean
} & FormatNumberOptions

export default function formatTruncatedBalance(
  balance: number | BigNumber,
  tokenSymbol: string,
  options?: FormatTruncatedBalanceOptions
) {
  return `${
    options?.showDollars ? formatTruncatedUSD(balance, options) : formatTruncatedNumber(balance)
  } ${tokenSymbol}`
}
