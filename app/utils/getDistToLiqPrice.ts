import { BigNumber } from '@ethersproject/bignumber'

import { UNIT } from '../constants/bn'
import fromBigNumber from './fromBigNumber'

export default function getDistToLiqPrice(spotPrice: BigNumber, liquidationPrice: BigNumber): number {
  return spotPrice.gt(0) ? fromBigNumber(liquidationPrice.sub(spotPrice).mul(UNIT).div(spotPrice)) : 0
}
