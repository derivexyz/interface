import CardSection from '@lyra/ui/components/Card/CardSection'
import Input from '@lyra/ui/components/Input'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

type Props = {
  calldata: string
  onChangeCalldata: (calldata: string) => void
} & MarginProps

const VoteCreateProposalCustomFields = ({ calldata, onChangeCalldata, ...styleProps }: Props) => {
  return (
    <CardSection noSpacing {...styleProps}>
      <Text variant="heading" color="text" mb={4}>
        Custom calldata
      </Text>
      <Input
        value={calldata}
        placeholder={'e.g. 0x34954SDFJKW8678DFBSJHDF'}
        onChange={event => {
          onChangeCalldata(event.target.value)
        }}
      />
    </CardSection>
  )
}

export default VoteCreateProposalCustomFields
