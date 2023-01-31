import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'

import OnboardingModal from '../../../containers/common/OnboardingModal'

export default function SocketDemoCard({ ...marginProps }: MarginProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Card {...marginProps}>
      <CardBody>
        <Button size="lg" variant="primary" label="Open Onboarding Modal" onClick={() => setIsOpen(true)} />
      </CardBody>
      <OnboardingModal
        toToken={{
          address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
          symbol: 'USDC',
          network: Network.Optimism,
          balance: ZERO_BN,
        }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context="to make your first trade"
      />
    </Card>
  )
}
