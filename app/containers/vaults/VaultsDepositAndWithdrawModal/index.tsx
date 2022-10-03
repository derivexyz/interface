import Modal from '@lyra/ui/components/Modal'
import React from 'react'

import VaultsDepositAndWithdrawForm from '../VaultsDepositAndWithdrawForm'

type Props = {
  marketAddressOrName: string
  isOpen: boolean
  onClose: () => void
  isDeposit: boolean
  onToggleDeposit: (isDeposit: boolean) => void
}

export default function VaultsDepositAndWithdrawModal({ onClose, isOpen, ...vaultsFormProps }: Props) {
  return (
    <Modal isMobileFullscreen isOpen={isOpen} onClose={onClose}>
      <VaultsDepositAndWithdrawForm {...vaultsFormProps} />
    </Modal>
  )
}
