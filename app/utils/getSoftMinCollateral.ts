import { BigNumber } from '@ethersproject/bignumber'
import { TradeCollateral } from '@lyrafinance/lyra-js'

import { UNIT, ZERO_BN } from '../constants/bn'
import { MIN_COLLATERAL_BUFFER } from '../constants/contracts'
import toBigNumber from './toBigNumber'

// TODO: @dappbeast Replace with min based on distance to liquidation price
export default function getSoftMinCollateral(collateral: TradeCollateral): BigNumber {
  const minCollateral = collateral.min
  return minCollateral.mul(toBigNumber(MIN_COLLATERAL_BUFFER) ?? ZERO_BN).div(UNIT)
}
