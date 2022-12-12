import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import React from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const LayoutPrivacyModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal title="Privacy" isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <Text mb={4} variant="secondary" color="secondaryText">
          This app uses the following third-party APIs:
        </Text>
        <Card variant="nested" mb={4}>
          <CardBody>
            <Flex mb={2} alignItems="center">
              <Icon mr={2} icon={IconType.Database} size={16} />
              <Text variant="bodyMedium">Node Providers</Text>
            </Flex>
            <Text variant="secondary" color="secondaryText">
              The app fetches on-chain data with APIs from node providers including{' '}
              <Link textVariant="secondary" href="https://www.infura.io" target="_blank">
                Infura
              </Link>
              .
            </Text>
          </CardBody>
        </Card>
        <Card variant="nested" mb={4}>
          <CardBody>
            <Flex mb={2} alignItems="center">
              <Icon mr={2} icon={IconType.BarChart2} size={16} />
              <Text variant="bodyMedium">Analytics</Text>
            </Flex>
            <Text variant="secondary" color="secondaryText">
              The app logs anonymized usage statistics and errors to open source platforms{' '}
              <Link textVariant="secondary" href="https://posthog.com/" target="_blank">
                PostHog
              </Link>{' '}
              and{' '}
              <Link textVariant="secondary" href="https://sentry.io/" target="_blank">
                Sentry
              </Link>{' '}
              in order to improve over time.
            </Text>
          </CardBody>
        </Card>
        <Card variant="nested" mb={4}>
          <CardBody>
            <Flex mb={2} alignItems="center">
              <Icon mr={2} icon={IconType.BarChart2} size={16} />
              <Text variant="bodyMedium">TRM Labs</Text>
            </Flex>
            <Text variant="secondary" color="secondaryText">
              The app securely collects your wallet address and transaction hashes and shares them with{' '}
              <Link textVariant="secondary" href="https://www.trmlabs.com/" target="_blank">
                TRM Labs Inc.
              </Link>{' '}
              for risk and compliance reasons.
            </Text>
          </CardBody>
        </Card>
        <Card variant="nested">
          <CardBody>
            <Flex mb={2} alignItems="center">
              <Icon mr={2} icon={IconType.Share2} size={16} />
              <Text variant="bodyMedium">The Graph</Text>
            </Flex>
            <Text variant="secondary" color="secondaryText">
              The app fetches blockchain data from{' '}
              <Link
                textVariant="secondary"
                href="https://thegraph.com/hosted-service/subgraph/lyra-finance/mainnet"
                target="_blank"
              >
                The Graph
              </Link>
              &nbsp;hosted service.
            </Text>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  )
}

export default LayoutPrivacyModal
