import Modal from '@lyra/ui/components/Modal'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import VaultsDepositForm from '../VaultsDepositForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  market: Market
}

export default function VaultsDepositFormModal({ isOpen, onClose, market }: Props) {
  return (
    <Modal isMobileFullscreen title="Deposit" isOpen={isOpen} onClose={onClose}>
      <VaultsDepositForm market={market} onClose={onClose} />
    </Modal>
  )
}
