import { BigNumber } from '@ethersproject/bignumber'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import RewardsArrakiStakeModalContent from './RewardsArrakisStakeModalContent'

type Props = {
  arrakisStaking: ArrakisStaking
  isOpen: boolean
  onClose: () => void
}

export default function RewardsArrakisStakeModal({ isOpen, onClose, arrakisStaking }: Props) {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stake WETH/LYRA">
      <CardBody>
        <Text mb={8} color="secondaryText">
          Add liquidity to the WETH/LYRA Uniswap v3 pool via Arrakis and stake your LP tokens to earn LYRA rewards.
          Rewards are continuous and you can unstake LP tokens at any time.
        </Text>
        <RewardsArrakiStakeModalContent
          arrakisStaking={arrakisStaking}
          amount={amount}
          onChange={val => setAmount(val)}
          onStake={() => {
            onClose()
            setAmount(ZERO_BN)
          }}
        />
      </CardBody>
    </Modal>
  )
}
