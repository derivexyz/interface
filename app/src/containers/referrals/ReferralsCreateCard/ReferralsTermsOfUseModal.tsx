import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Checkbox from '@lyra/ui/components/Input/Checkbox'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import React, { useState } from 'react'

import { REFERRALS_TERMS_OF_USE_URL, TERMS_OF_USE_URL } from '@/app/constants/links'
import useWallet from '@/app/hooks/account/useWallet'
import useIsReferralTermsAccepted from '@/app/hooks/referrals/useIsReferralTermsAccepted'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'
import isTermsOfUseEnabled from '@/app/utils/isTermsOfUseEnabled'
import postReferralsTermsOfUse from '@/app/utils/referrals/postReferralsTermsOfUse'

type Props = {
  isOpen: boolean
  onClose: () => void
  onCreate: (value: string) => Promise<boolean>
  referrerCode: string | null | undefined
}

export default function ReferralsTermsOfUseModal({ isOpen, onClose, onCreate, referrerCode }: Props) {
  const [isChecked, setIsChecked] = useState(false)
  const [isBChecked, setIsBChecked] = useState(false)
  const { account } = useWallet()
  const [_, setIsReferralTermsAccepted] = useIsReferralTermsAccepted()
  const [isLoading, setIsLoading] = useState(false)

  if (!isTermsOfUseEnabled() || !account) {
    // Ignore terms when account is not connected or we're on testnet
    return null
  }

  return (
    <Modal title="Disclaimer" isOpen={isOpen} onClose={onClose} width={600}>
      <CardBody>
        <Text color="secondaryText" mb={6}>
          Check the boxes below to confirm your agreement to the&nbsp;
          <Link href={REFERRALS_TERMS_OF_USE_URL} target="_blank">
            Referral Terms:
          </Link>
        </Text>
        <Flex mb={6} alignItems="center" onClick={() => setIsChecked(!isChecked)} sx={{ cursor: 'pointer' }}>
          <Box mr={2} minWidth={36}>
            <Checkbox checked={isChecked} onToggle={setIsChecked} />
          </Box>
          <Text color="secondaryText">
            By clicking this checkbox you represent that you have read, understand and agree to be bound by the Referral
            Terms (including changes from time to time) governing your use of the Referral Program. You will be taken to
            have agreed to the Referral Terms in respect of all instances of your use of the Referral Program.
          </Text>
        </Flex>
        <Flex mb={6} alignItems="center" onClick={() => setIsBChecked(!isBChecked)} sx={{ cursor: 'pointer' }}>
          <Box mr={2} minWidth={36}>
            <Checkbox checked={isBChecked} onToggle={setIsBChecked} />
          </Box>
          <Text color="secondaryText">
            By clicking this checkbox you confirm that you are not a Restricted Person (as defined in the{' '}
            <Link href={TERMS_OF_USE_URL} target="_blank">
              Terms of Use
            </Link>
            ) and will not promote the Lyra Protocol to Restricted Persons.
          </Text>
        </Flex>
        <Button
          width="100%"
          isDisabled={!isChecked || !isBChecked}
          label="Confirm"
          variant="primary"
          isLoading={isLoading}
          size="lg"
          onClick={async () => {
            setIsReferralTermsAccepted()
            if (isScreeningEnabled()) {
              setIsLoading(true)
              const isPostSuccessful = await postReferralsTermsOfUse(account)
              if (isPostSuccessful) {
                setIsLoading(false)
                if (!!referrerCode) {
                  await onCreate(referrerCode)
                  onClose()
                }
                onClose()
              } else {
                setIsLoading(false)
              }
            } else {
              onClose()
            }
          }}
        />
      </CardBody>
    </Modal>
  )
}
