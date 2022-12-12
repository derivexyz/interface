import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import { MarginProps } from '@lyra/ui/types'
import React, { useState } from 'react'

import OnboardingModal from '../../../containers/common/OnboardingModal'

export default function SocketDemoCard({ ...marginProps }: MarginProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Card {...marginProps}>
      <CardBody>
        <Button size="lg" variant="primary" label="Open Onboarding Modal" onClick={() => setIsOpen(true)} />
      </CardBody>
      <OnboardingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Card>
  )
}
