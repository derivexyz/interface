import Modal from '@lyra/ui/components/Modal'
import React from 'react'

import { Vault } from '@/app/constants/vault'

import VaultsWithdrawForm from '../VaultsWithdrawForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  vault: Vault
}

export default function VaultsWithdrawFormModal({ isOpen, onClose, vault }: Props) {
  return (
    <Modal title="Withdraw" isOpen={isOpen} onClose={onClose}>
      <VaultsWithdrawForm vault={vault} onClose={onClose} />
    </Modal>
  )
}
