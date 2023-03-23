import CardBody from '@lyra/ui/components/Card/CardBody'
import Modal from '@lyra/ui/components/Modal'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import RewardsArrakisUnstakeModalContent from './RewardsArrakisUnstakeModalContent'

type Props = {
  isOpen: boolean
  arrakisStaking: ArrakisStaking
  onClose: () => void
}

export default function RewardsArrakisUnstakeModal({ isOpen, arrakisStaking, onClose }: Props) {
  const [amount, setAmount] = useState(ZERO_BN)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unstake WETH/LYRA">
      <CardBody>
        <RewardsArrakisUnstakeModalContent
          arrakisStaking={arrakisStaking}
          amount={amount}
          onChange={val => setAmount(val)}
          onUnstake={() => {
            onClose()
            setAmount(ZERO_BN)
          }}
        />
      </CardBody>
    </Modal>
  )
}
