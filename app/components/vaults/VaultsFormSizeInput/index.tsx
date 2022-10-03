import { BigNumber } from '@ethersproject/bignumber'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'

type Props = {
  amount: BigNumber
  max?: BigNumber
  onChangeAmount: (amount: BigNumber) => void
} & MarginProps

const VaultsFormSizeInput = ({ amount, max, onChangeAmount, ...styleProps }: Props) => {
  return (
    <BigNumberInput
      {...styleProps}
      width="50%"
      value={amount}
      onChange={onChangeAmount}
      placeholder={ZERO_BN}
      max={max}
      min={ZERO_BN}
      textAlign="right"
      showMaxButton
    />
  )
}

export default VaultsFormSizeInput
