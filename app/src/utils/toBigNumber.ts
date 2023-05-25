import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

export default function toBigNumber(number: number, decimals: number = 18): BigNumber {
  return parseUnits(number.toFixed(decimals).toString(), decimals)
}
