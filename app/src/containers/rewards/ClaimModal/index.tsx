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
  const [isStkLyraChecked, setIsStkLyraChecked] = useState(false)
  const [isOpChecked, setIsOpChecked] = useState(false)
  const [isLyraChecked, setIsLyraChecked] = useState(false)
  const [isWethLyraChecked, setIsWethLyraChecked] = useState(false)

  const handleClickStkLyra = () => {
    setIsStkLyraChecked(!isStkLyraChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickOp = () => {
    setIsOpChecked(!isOpChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickLyra = () => {
    setIsLyraChecked(!isLyraChecked)
    setIsWethLyraChecked(false)
  }
  const handleClickWethLyra = () => {
    setIsWethLyraChecked(!isWethLyraChecked)
    setIsOpChecked(false)
    setIsStkLyraChecked(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Rewards">
      <ModalBody>
        <ClaimModalContent
          isOpChecked={isOpChecked}
          isStkLyraChecked={isStkLyraChecked}
          isWethLyraChecked={isWethLyraChecked}
          isLyraChecked={isLyraChecked}
          onClickOp={handleClickOp}
          onClickStkLyra={handleClickStkLyra}
          onClickWethLyra={handleClickWethLyra}
          onClickLyra={handleClickLyra}
        />
        <ClaimButton
          isLyraChecked={isLyraChecked}
          isOpChecked={isOpChecked}
          isStkLyraChecked={isStkLyraChecked}
          isWethLyraChecked={isWethLyraChecked}
          onClaim={onClose}
        />
      </ModalBody>
    </Modal>
  )
})

export default ClaimModal
