import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'

import ClaimWethLyraStakingRewardsButton from './ClaimWethLyraStakingRewardsButton'
import ClaimWethLyraStakingRewardsModalContent from './ClaimWethLyraStakingRewardsModalContent'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimWethLyraStakingRewardsModal = withSuspense(({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim L1 Weth/Lyra Rewards">
      <ModalBody>
        <ClaimWethLyraStakingRewardsModalContent />
        <ClaimWethLyraStakingRewardsButton onClaim={onClose} />
      </ModalBody>
    </Modal>
  )
})

export default ClaimWethLyraStakingRewardsModal
