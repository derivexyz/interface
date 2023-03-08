import { Option, Quote, Strike } from '@lyrafinance/lyra-js'

import { ONE_BN } from './bn'

export const MIN_COLLATERAL_BUFFER = 1.05 // 5% buffer
export const CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER = 2.5 // 250% of default for cash-secured calls
export const MAX_IV = ONE_BN.mul(5) // 500%
export const MIN_DIST_TO_LIQUIDATION_PRICE = 0.01
export const ERROR_DIST_TO_LIQUIDATION_PRICE = 0.015
export const WARNING_DIST_TO_LIQUIDATION_PRICE = 0.025
export const MAX_UTILIZATION = 0.975

export const ITERATIONS = 3
export const SLIPPAGE = 0.1 / 100 // 0.1%

export type StrikeQuotesNullable = {
  callBid: Quote | null
  callAsk: Quote | null
  putBid: Quote | null
  putAsk: Quote | null
  strike: Strike
}

export type OptionQuotesNullable = {
  bid: Quote | null
  ask: Quote | null
  option: Option
}
