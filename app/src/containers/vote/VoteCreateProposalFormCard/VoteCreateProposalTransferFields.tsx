import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import Input from '@lyra/ui/components/Input'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'

type Props = {
  targetAddress: string
  tokenAddress: string
  tokenAmount: BigNumber
  onChangeAmount: (tokenAmount: BigNumber) => void
  onChangeAddress: (tokenAddess: string) => void
  onChangeTargetAddress: (targetAddress: string) => void
} & MarginProps

const VoteCreateProposalTransferFields = ({
  targetAddress,
  tokenAddress,
  tokenAmount,
  onChangeAmount,
  onChangeAddress,
  onChangeTargetAddress,
  ...styleProps
}: Props) => {
  return (
    <CardSection noSpacing {...styleProps}>
      <Text variant="heading" color="text" mb={4}>
        Target address, token address and amount to transfer
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr'], gridColumnGap: [3, 6], gridRowGap: [3, 6] }}>
        <Input
          value={targetAddress}
          placeholder={'Wallet or Contract address'}
          onChange={event => {
            onChangeTargetAddress(event.target.value)
          }}
        />
        <Input
          value={tokenAddress}
          placeholder={'Token address'}
          onChange={event => {
            onChangeAddress(event.target.value)
          }}
        />
        <BigNumberInput flexGrow={1} value={tokenAmount} onChange={onChangeAmount} placeholder={ZERO_BN} />
      </Grid>
    </CardSection>
  )
}

export default VoteCreateProposalTransferFields
