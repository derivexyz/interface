import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import React, { useState } from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'

import ClaimButton from './ClaimButton'
import ClaimModalContent from './ClaimModalContent'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimModal = withSuspense(({ isOpen, onClose }: Props): JSX.Element => {
  const [isNewStkLyraChecked, setIsNewStkLyraChecked] = useState(false)
  const [isOldStkLyraChecked, setIsOldStkLyraChecked] = useState(false)
  const [isOpChecked, setIsOpChecked] = useState(false)
  const [isWethLyraChecked, setIsWethLyraChecked] = useState(false)
  const [isLyraChecked, setIsLyraChecked] = useState(false)

  const handleClickLyra = () => {
    setIsLyraChecked(!isLyraChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickNewStkLyra = () => {
    setIsNewStkLyraChecked(!isNewStkLyraChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickOp = () => {
    setIsOpChecked(!isOpChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickOldStkLyra = () => {
    setIsOldStkLyraChecked(!isOldStkLyraChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickWethLyra = () => {
    setIsWethLyraChecked(!isWethLyraChecked)
    setIsOpChecked(false)
    setIsNewStkLyraChecked(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Rewards">
      <ModalBody>
        <ClaimModalContent
          isLyraChecked={isLyraChecked}
          isOpChecked={isOpChecked}
          isNewStkLyraChecked={isNewStkLyraChecked}
          isOldStkLyraChecked={isOldStkLyraChecked}
          isWethLyraChecked={isWethLyraChecked}
          onClickLyra={handleClickLyra}
          onClickOp={handleClickOp}
          onClickNewStkLyra={handleClickNewStkLyra}
          onClickWethLyra={handleClickWethLyra}
          onClickOldStkLyra={handleClickOldStkLyra}
        />
        <ClaimButton
          isLyraChecked={isLyraChecked}
          isOpChecked={isOpChecked}
          isNewStkLyraChecked={isNewStkLyraChecked}
          isOldStkLyraChecked={isOldStkLyraChecked}
          isWethLyraChecked={isWethLyraChecked}
          onClaim={onClose}
        />
      </ModalBody>
    </Modal>
  )
})

export default ClaimModal
