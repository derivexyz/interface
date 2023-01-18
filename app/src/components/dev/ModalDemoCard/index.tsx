import Button from '@lyra/ui/components/Button'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import { IconType } from '@lyra/ui/components/Icon'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import { createPendingToast, createToast } from '@lyra/ui/components/Toast'
import { MarginProps } from '@lyra/ui/types'
import React, { useState } from 'react'

import emptyFunction from '@/app/utils/emptyFunction'

export default function ModalDemoCard({ ...marginProps }: MarginProps): CardElement {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Card {...marginProps}>
      <CardSection>
        <Text variant="heading">Modal</Text>
        <Button my={4} onClick={() => setIsOpen(true)} label="Open Modal" />
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalBody>
            <Text textAlign="center" variant="heading" color="secondaryText">
              Welcome to
            </Text>
            <Text my={4} textAlign="center" variant="title" color="secondaryText">
              Avalon Testnet
            </Text>
            <Text textAlign="center" variant="heading" color="secondaryText">
              We are using sETH and sUSD for testnet. Claim your testnet tokens here.
            </Text>
            <Button mb={4} mt={8} variant="light" label="0 ETH" size="lg" leftIcon={IconType.Optimism} />
            <Button
              mb={8}
              variant="light"
              label="0 sETH"
              size="lg"
              leftIcon="https://static.optimism.io/logos/sETH.svg"
            />
            <Button
              mb={4}
              variant="light"
              label="0 sUSD"
              size="lg"
              leftIcon="https://static.optimism.io/logos/sUSD.svg"
            />
            <Button
              onClick={emptyFunction}
              mt="auto"
              label="Switch to Kovan"
              size="lg"
              minWidth={'60%'}
              variant="primary"
            />
          </ModalBody>
        </Modal>
      </CardSection>
      <CardSection>
        <Text variant="heading">Toasts</Text>
        <Button
          variant={'default'}
          mr={2}
          mt={2}
          label="Create Default Toast"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'info',
              description: 'Default: This is a default toast.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
            })
          }}
        />
        <Button
          variant={'primary'}
          mr={2}
          mt={2}
          label="Create Success Toast"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'success',
              description: 'Success: This is a success toast.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
            })
          }}
        />
        <Button
          variant={'error'}
          mr={2}
          mt={2}
          label="Create Error Toast"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'error',
              description: 'Error: This is an error toast.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
            })
          }}
        />
        <Button
          variant={'warning'}
          mr={2}
          mt={2}
          label="Create Warning Toast"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'warning',
              description: 'Warning: This is a warning toast.',
              hrefLabel: 'This is hrefLabel.',
              href: '/portfolio',
              target: 'blank',
            })
          }}
        />
        <Button
          variant={'primary'}
          mr={2}
          mt={2}
          isOutline
          label="Create Default Toast with Icon"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'info',
              description: 'Default: This is a default toast with icon.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
              icon: IconType.Activity,
            })
          }}
        />
        <Button
          variant={'primary'}
          mr={2}
          mt={2}
          isOutline
          label="Create Success Toast with Icon"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'success',
              description: 'Success: This is a success toast with icon.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
              icon: IconType.CheckCircle,
            })
          }}
        />
        <Button
          variant={'primary'}
          mr={2}
          mt={2}
          isOutline
          label="Create Error Toast with Icon"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'error',
              description: 'Error: This is an error toast with icon.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
              icon: IconType.AlertTriangle,
            })
          }}
        />
        <Button
          variant={'primary'}
          mr={2}
          mt={2}
          isOutline
          label="Create Warning Toast with Icon"
          size={'medium'}
          onClick={() => {
            createToast({
              variant: 'warning',
              description: 'Warning: This is a warning toast with icon.',
              hrefLabel: 'This is hrefLabel.',
              href: '/portfolio',
              target: 'blank',
              icon: IconType.Flag,
            })
          }}
        />
        <Button
          variant={'primary'}
          mr={2}
          mt={2}
          isOutline
          label="Create Pending Toast"
          size={'medium'}
          onClick={() => {
            createPendingToast({
              description: 'Pending: This is a pending toast.',
              hrefLabel: 'This is hrefLabel',
              href: '/portfolio',
              target: 'blank',
            })
          }}
        />
      </CardSection>
    </Card>
  )
}
