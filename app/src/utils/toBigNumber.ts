import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

export default function toBigNumber(number: number, decimals: number = 18): BigNumber {
  const numberStr = number.toString().includes('e') ? number.toFixed(decimals).toString() : number.toString()
  return parseUnits(numberStr, decimals)
}
