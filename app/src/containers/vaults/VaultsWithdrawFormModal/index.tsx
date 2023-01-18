import Modal from '@lyra/ui/components/Modal'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import VaultsWithdrawForm from '../VaultsWithdrawForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  market: Market
}

export default function VaultsWithdrawFormModal({ isOpen, onClose, market }: Props) {
  return (
    <Modal isMobileFullscreen title="Withdraw" isOpen={isOpen} onClose={onClose}>
      <VaultsWithdrawForm market={market} onClose={onClose} />
    </Modal>
  )
}
