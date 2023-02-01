import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

export default function SentryDemoCard({ ...marginProps }: MarginProps) {
  return (
    <Card {...marginProps}>
      <CardBody>
        <Button
          size="lg"
          variant="error"
          label="Send Error"
          onClick={() => {
            throw new Error('Dev test')
          }}
        />
      </CardBody>
    </Card>
  )
}
