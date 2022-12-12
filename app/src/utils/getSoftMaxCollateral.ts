import { BigNumber } from '@ethersproject/bignumber'
import { Trade, TradeCollateral } from '@lyrafinance/lyra-js'

import { UNIT, ZERO_BN } from '../constants/bn'
import { CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER } from '../constants/contracts'
import toBigNumber from './toBigNumber'

export default function getSoftMaxCollateral(trade: Trade, collateral: TradeCollateral): BigNumber {
  const cashSecuredMax = trade.newSize
    .mul(trade.strike().strikePrice)
    .div(UNIT)
    .mul(toBigNumber(CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER) ?? ZERO_BN)
    .div(UNIT)

  const max = collateral.max
    ? collateral.max
    : // For cash-secured calls, set max to 1.25 * size * strike
    cashSecuredMax.gt(collateral.min)
    ? cashSecuredMax
    : collateral.min

  return max
}
