import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import { TERMS_OF_USE_URL } from '@/app/constants/links'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const LayoutPrivacyModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal title="Privacy" isOpen={isOpen} onClose={onClose}>
      <ModalSection>
        <Text variant="small" color="secondaryText">
          This app uses third-party APIs. Learn more about our{' '}
          <Link variant="small" href={TERMS_OF_USE_URL} target="_blank" showRightIcon>
            Privacy Policy
          </Link>
        </Text>
      </ModalSection>
      <CardSeparator />
      <ModalSection>
        <Flex mb={2} alignItems="center">
          <Icon mr={2} icon={IconType.Database} size={16} />
          <Text variant="bodyMedium">Node Providers</Text>
        </Flex>
        <Text variant="small" color="secondaryText">
          The app fetches on-chain data with APIs from node providers including{' '}
          <Link variant="small" href="https://www.alchemy.com/" target="_blank" showRightIcon>
            Alchmey
          </Link>
        </Text>
      </ModalSection>
      <CardSeparator />
      <ModalSection>
        <Flex mb={2} alignItems="center">
          <Icon mr={2} icon={IconType.Share2} size={16} />
          <Text variant="bodyMedium">Indexing</Text>
        </Flex>
        <Text variant="small" color="secondaryText">
          The app indexes and fetches blockchain data using{' '}
          <Link variant="small" href="https://satsuma.xyz/" target="_blank" showRightIcon>
            Satsuma
          </Link>
        </Text>
      </ModalSection>
      <CardSeparator />
      <ModalSection>
        <Flex mb={2} alignItems="center">
          <Icon mr={2} icon={IconType.BarChart2} size={16} />
          <Text variant="bodyMedium">Analytics</Text>
        </Flex>
        <Text variant="small" color="secondaryText">
          The app logs anonymized usage statistics and errors to open source platforms{' '}
          <Link variant="small" href="https://www.spindl.xyz/" target="_blank">
            Spindl
          </Link>{' '}
          and{' '}
          <Link variant="small" href="https://sentry.io/" target="_blank">
            Sentry
          </Link>{' '}
          in order to improve over time.
        </Text>
      </ModalSection>
      <CardSeparator />
      <ModalSection>
        <Flex mb={2} alignItems="center">
          <Icon mr={2} icon={IconType.BarChart2} size={16} />
          <Text variant="bodyMedium">TRM Labs</Text>
        </Flex>
        <Text variant="small" color="secondaryText">
          The app securely collects your wallet address and transaction hashes and shares them with{' '}
          <Link variant="small" href="https://www.trmlabs.com/" target="_blank">
            TRM Labs Inc.
          </Link>{' '}
          for risk and compliance reasons.
        </Text>
      </ModalSection>
    </Modal>
  )
}

export default LayoutPrivacyModal
