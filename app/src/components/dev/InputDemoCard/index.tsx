import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Input from '@lyra/ui/components/Input'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Slider from '@lyra/ui/components/Slider'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import toBigNumber from '@/app/utils/toBigNumber'

export default function InputDemoCard({ ...marginProps }: MarginProps): CardElement {
  const [text, setText] = useState('')
  const [n, setN] = useState(50)
  const [num, setNum] = useState(ZERO_BN)

  return (
    <Card {...marginProps}>
      <CardSection>
        <Flex my={2}>
          <Input label="Text" placeholder="Type something" value={text} onChange={e => setText(e.target.value)} />
        </Flex>

        <Flex my={2}>
          <Input
            label="Error"
            error="Something went wrong"
            placeholder="Type something"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </Flex>
        <Flex my={2}>
          <Input
            label="Success"
            isSuccess
            placeholder="Type something"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </Flex>
        <Flex my={2}>
          <BigNumberInput label="Big Number" value={num} onChange={setNum} />
        </Flex>
        <Flex my={2}>
          <BigNumberInput
            label="Big Number with Max"
            value={num}
            onChange={setNum}
            max={toBigNumber(10000) ?? ZERO_BN}
            showMaxButton
          />
        </Flex>
        <Text variant="small" color="secondaryText">
          Slider
        </Text>
        <Slider value={n} color={n > 50 ? 'primaryText' : 'errorText'} onChange={n => setN(n)} max={100} min={10} />
      </CardSection>
    </Card>
  )
}
