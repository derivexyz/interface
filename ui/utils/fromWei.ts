import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'

export default function fromWei(number: BigNumber): number {
  return parseFloat(formatEther(number.toString()))
}
