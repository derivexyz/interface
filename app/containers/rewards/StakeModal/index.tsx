import Modal from '@lyra/ui/components/Modal'
import React from 'react'

import StakeCardBody from '../StakeCardBody'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function StakeModal(props: Props) {
  const { isOpen, onClose } = props
  return (
    <Modal noPadding isOpen={isOpen} onClose={onClose} title="Stake LYRA">
      <StakeCardBody onClose={onClose} />
    </Modal>
  )
}
