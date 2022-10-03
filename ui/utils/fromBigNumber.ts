import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

export default function fromBigNumber(number: BigNumber, decimals: number): number {
  return parseFloat(formatUnits(number.toString(), decimals))
}
