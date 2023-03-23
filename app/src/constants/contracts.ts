import { Option, Quote, Strike } from '@lyrafinance/lyra-js'

import {
  ArrakisPoolL1,
  ArrakisPoolL2,
  ArrakisStakingRewards,
  CamelotNitroPool,
  CamelotPool,
  Multicall3,
} from '../contracts/typechain'
import { ONE_BN } from './bn'

export const MIN_COLLATERAL_BUFFER = 1.05 // 5% buffer
export const CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER = 2.5 // 250% of default for cash-secured calls
export const MAX_IV = ONE_BN.mul(5) // 500%
export const MIN_DIST_TO_LIQUIDATION_PRICE = 0.01
export const ERROR_DIST_TO_LIQUIDATION_PRICE = 0.015
export const WARNING_DIST_TO_LIQUIDATION_PRICE = 0.025
export const MAX_UTILIZATION = 0.975

export const ITERATIONS = 3
export const SLIPPAGE = 2 / 100 // 2%

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

export enum ContractId {
  ArrakisPoolL1 = 'ArrakisPoolL1',
  ArrakisPoolL2 = 'ArrakisPoolL2',
  ArrakisStakingRewards = 'ArrakisStakingRewards',
  ArrakisOpStakingRewards = 'ArrakisOpStakingRewards',
  CamelotPool = 'CamelotPool',
  CamelotNitroPool = 'CamelotNitroPool',
  Multicall3 = 'Multicall3',
}

export type ContractMap = {
  [ContractId.ArrakisPoolL1]: ArrakisPoolL1
  [ContractId.ArrakisPoolL2]: ArrakisPoolL2
  [ContractId.ArrakisStakingRewards]: ArrakisStakingRewards
  [ContractId.ArrakisOpStakingRewards]: ArrakisStakingRewards
  [ContractId.CamelotPool]: CamelotPool
  [ContractId.CamelotNitroPool]: CamelotNitroPool
  [ContractId.Multicall3]: Multicall3
}
