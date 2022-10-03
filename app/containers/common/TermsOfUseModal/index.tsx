import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Checkbox from '@lyra/ui/components/Input/Checkbox'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import React, { useState } from 'react'

import { TERMS_OF_USE_URL } from '@/app/constants/links'
import useWallet from '@/app/hooks/wallet/useWallet'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'
import isTermsOfUseEnabled from '@/app/utils/isTermsOfUseEnabled'
import postTermsOfUse from '@/app/utils/postTermsOfUse'

type Props = {
  isOpen: boolean
  onConfirm: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  onClose: () => void
}

export default function TermsOfUseModal({ isOpen, onClose, onConfirm }: Props) {
  const [isAChecked, setIsAChecked] = useState(false)
  const [isBChecked, setIsBChecked] = useState(false)
  const { account } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  if (!isTermsOfUseEnabled() || !account || !isOptimismMainnet()) {
    // Ignore terms when account is not connected or we're on testnet
    return null
  }
  return (
    <Modal title="Disclaimer" isOpen={isOpen} onClose={onClose} width={600}>
      <CardBody>
        <Text color="secondaryText" mb={6}>
          Check the boxes below to confirm your agreement to the&nbsp;
          <Link href={TERMS_OF_USE_URL} target="_blank">
            Terms of Use:
          </Link>
        </Text>
        <Flex mb={6} alignItems="center" onClick={() => setIsAChecked(!isAChecked)} sx={{ cursor: 'pointer' }}>
          <Box mr={2} minWidth={36}>
            <Checkbox checked={isAChecked} onToggle={setIsAChecked} />
          </Box>
          <Text color="secondaryText">
            By clicking this checkbox you represent that you have read, understand and agree to be bound by the Terms of
            Use (including changes from time to time) governing your use of the Interface. You will be taken to have
            agreed to the Terms of Use in respect of all instances of your use of the Interface.
          </Text>
        </Flex>
        <Flex mb={6} alignItems="center" onClick={() => setIsBChecked(!isBChecked)} sx={{ cursor: 'pointer' }}>
          <Box mr={2} minWidth={36}>
            <Checkbox checked={isBChecked} onToggle={setIsBChecked} />
          </Box>
          <Text color="secondaryText">
            By clicking this checkbox you represent that you have read and make the acknowledgements set out in clause
            3.2 of the Terms of Use and understand the risks and disclaimers set out in clause 5 of the Terms of Use.
            You understand that we have no control over your assets or the Lyra protocol.
          </Text>
        </Flex>
        <Button
          width="100%"
          isDisabled={!isAChecked || !isBChecked}
          label="Confirm"
          variant="primary"
          isLoading={isLoading}
          size="lg"
          onClick={e => {
            if (isScreeningEnabled()) {
              setIsLoading(true)
              postTermsOfUse(account)
                .then(ok => {
                  if (ok) {
                    onConfirm(e)
                    onClose()
                  }
                  setIsLoading(false)
                })
                .catch(() => setIsLoading(false))
            } else {
              onConfirm(e)
              onClose()
            }
          }}
        />
      </CardBody>
    </Modal>
  )
}
