import Modal from '@lyra/ui/components/Modal'
import React from 'react'

import { Vault } from '@/app/constants/vault'

import VaultsDepositForm from '../VaultsDepositForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  vault: Vault
}

export default function VaultsDepositFormModal({ isOpen, onClose, vault }: Props) {
  return (
    <Modal title="Deposit" isOpen={isOpen} onClose={onClose}>
      <VaultsDepositForm vault={vault} onClose={onClose} />
    </Modal>
  )
}
