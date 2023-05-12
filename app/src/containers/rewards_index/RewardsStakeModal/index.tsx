import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { BigNumber } from 'ethers'
import React from 'react'
import { useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import RewardsStakeFormAmountInput from './RewardsStakeFormAmountInput'
import StakeFormButton from './RewardsStakeFormButton'

type Props = {
  lyraStaking: LyraStaking
  isOpen: boolean
  onClose: () => void
}

export default function RewardsStakeModal({ isOpen, onClose, lyraStaking }: Props) {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stake LYRA">
      <ModalBody variant="elevated">
        <Text color="secondaryText" width="100%" mb={10}>
          By staking LYRA you earn stkLYRA rewards and you receive boosts on your vault and trading rewards. Staked LYRA
          has a 14 day unstaking period.
        </Text>
        <RowItem
          label="Amount to Stake"
          value={
            <RewardsStakeFormAmountInput
              amount={amount}
              max={lyraStaking.lyraBalance}
              onChangeAmount={newAmount => setAmount(newAmount)}
              ml="auto"
              mr={-3}
            />
          }
        />
        <RowItem my={6} label="Balance" value={<Text>{formatNumber(lyraStaking.lyraBalance)} LYRA</Text>} />
        <RowItem mb={12} label="APY" value={<Text>{formatPercentage(lyraStaking.apy, true)}</Text>} />
        <StakeFormButton amount={amount} onClose={onClose} />
      </ModalBody>
    </Modal>
  )
}
