import Modal from '@lyra/ui/components/Modal'
import React from 'react'

import UnstakeCardBody from '../UnstakeCardBody'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function UnstakeModal(props: Props) {
  const { isOpen, onClose } = props
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unstake LYRA">
      <UnstakeCardBody onClose={onClose} />
    </Modal>
  )
}
