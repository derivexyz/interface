import Alert from '@lyra/ui/components/Alert'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import { IconType } from '@lyra/ui/components/Icon'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

export default function AlertDemoCard({ ...marginProps }: MarginProps): CardElement {
  return (
    <Card {...marginProps}>
      <CardSection>
        <Alert title="hello" my={2} />
        <Alert title="hello" variant="primary" my={2} />
        <Alert title="hello" variant="error" my={2} />
        <Alert
          title="Hello world"
          icon={IconType.Activity}
          description="This is a description"
          variant="primary"
          my={2}
        />
      </CardSection>
    </Card>
  )
}
