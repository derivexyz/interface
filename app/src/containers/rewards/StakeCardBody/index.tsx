import { BigNumber } from '@ethersproject/bignumber'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'

import StakeCardBodyBottomSection from './StakeCardBodyBottomSection'
import StakeCardBodyTopSection from './StakeCardBodyTopSection'

type Props = {
  onClose: () => void
}

const StakeCardBody = ({ onClose }: Props) => {
  const [vault, setVault] = useState<Market | null>(null)
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  return (
    <>
      <StakeCardBodyTopSection amount={amount} onChangeAmount={setAmount} />
      <CardSeparator />
      <StakeCardBodyBottomSection amount={amount} vault={vault} setVault={setVault} onClose={onClose} />
    </>
  )
}

export default StakeCardBody
