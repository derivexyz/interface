import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

export default function toBigNumber(number: number | string, decimals: number = 18): BigNumber | null {
  if (typeof number === 'number' && isNaN(number)) {
    return null
  }
  try {
    return parseUnits(number.toString(), decimals)
  } catch (err) {
    return null
  }
}
