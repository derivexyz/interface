import { ONE_BN } from './bn'

export const MIN_COLLATERAL_BUFFER = 1.05 // 5% buffer
export const CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER = 2.5 // 250% of default for cash-secured calls
export const MAX_IV = ONE_BN.mul(5) // 500%
export const MIN_DIST_TO_LIQUIDATION_PRICE = 0.01
export const ERROR_DIST_TO_LIQUIDATION_PRICE = 0.015
export const WARNING_DIST_TO_LIQUIDATION_PRICE = 0.025
