import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'

import ClaimButton from './ClaimStakingRewardsButton'
import ClaimStakingRewardsModalContent from './ClaimStakingRewardsModalContent'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimStakingRewardsModal = withSuspense(({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Staking Rewards">
      <ModalBody>
        <ClaimStakingRewardsModalContent />
        <ClaimButton onClaim={onClose} />
      </ModalBody>
    </Modal>
  )
})

export default ClaimStakingRewardsModal
