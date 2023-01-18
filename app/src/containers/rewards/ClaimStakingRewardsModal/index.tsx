import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import React, { useCallback, useState } from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'

import ClaimButton from './ClaimStakingRewardsButton'
import ClaimStakingRewardsModalContent from './ClaimStakingRewardsModalContent'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimStakingRewardsModal = withSuspense(({ isOpen, onClose }: Props): JSX.Element => {
  const [isNewStkLyraChecked, setIsStkLyraChecked] = useState(false)

  const handleClickStkLyra = useCallback(() => {
    setIsStkLyraChecked(!isNewStkLyraChecked)
  }, [isNewStkLyraChecked])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Staking Rewards">
      <ModalBody>
        <ClaimStakingRewardsModalContent
          isNewStkLyraChecked={isNewStkLyraChecked}
          onClickStkLyra={handleClickStkLyra}
        />
        <ClaimButton isNewStkLyraChecked={isNewStkLyraChecked} onClaim={onClose} />
      </ModalBody>
    </Modal>
  )
})

export default ClaimStakingRewardsModal
