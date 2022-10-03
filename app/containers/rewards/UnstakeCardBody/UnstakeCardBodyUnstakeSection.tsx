import { BigNumber } from '@ethersproject/bignumber'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'

import UnstakeCardBodyBottomSection from './UnstakeCardBodyBottomSection'
import UnstakeCardBodyTopSection from './UnstakeCardBodyTopSection'

type Props = {
  onClose: () => void
}

const UnstakeCardBodyUnstakeSection = ({ onClose }: Props) => {
  const [vault, setVault] = useState<Market | null>(null)
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  return (
    <>
      <UnstakeCardBodyTopSection amount={amount} onChangeAmount={setAmount} />
      <CardSeparator />
      <UnstakeCardBodyBottomSection amount={amount} vault={vault} setVault={setVault} onClose={onClose} />
    </>
  )
}

export default UnstakeCardBodyUnstakeSection
