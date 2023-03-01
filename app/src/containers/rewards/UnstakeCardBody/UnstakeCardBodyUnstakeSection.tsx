import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'

import UnstakeCardBodyBottomSection from './UnstakeCardBodyBottomSection'
import UnstakeCardBodyTopSection from './UnstakeCardBodyTopSection'

type Props = {
  onClose: () => void
}

const UnstakeCardBodyUnstakeSection = ({ onClose }: Props) => {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  return (
    <>
      <UnstakeCardBodyTopSection amount={amount} onChangeAmount={setAmount} />
      <UnstakeCardBodyBottomSection amount={amount} onClose={onClose} />
    </>
  )
}

export default UnstakeCardBodyUnstakeSection
