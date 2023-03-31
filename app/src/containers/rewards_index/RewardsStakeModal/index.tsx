import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { AccountLyraBalances } from '@lyrafinance/lyra-js'
import { LyraStaking } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React from 'react'
import { useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'

import RewardsStakeFormAmountInput from './RewardsStakeFormAmountInput'
import StakeFormButton from './RewardsStakeFormButton'

type Props = {
  lyraStaking: LyraStaking
  lyraBalances: AccountLyraBalances
  isOpen: boolean
  onClose: () => void
}

export default function RewardsStakeModal({ isOpen, onClose, lyraStaking, lyraBalances }: Props) {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  const maxStakeBalance = lyraBalances.ethereumLyra
  return (
    <Modal noPadding isOpen={isOpen} onClose={onClose} title="Stake LYRA">
      <ModalBody variant="elevated">
        <Text variant="body" color="secondaryText" width="100%" mb={10}>
          By staking LYRA you earn stkLYRA rewards and you receive boosts on your vault and trading rewards. Staked LYRA
          has a 14 day unstaking period.
        </Text>
        <RowItem
          textVariant="body"
          label="Amount to Stake"
          value={
            <RewardsStakeFormAmountInput
              amount={amount}
              max={maxStakeBalance}
              onChangeAmount={newAmount => setAmount(newAmount)}
              ml="auto"
              mr={-3}
            />
          }
        />
        <RowItem
          textVariant="body"
          my={6}
          label="Balance"
          value={<Text>{formatNumber(lyraBalances.ethereumLyra)} LYRA</Text>}
        />
        <RowItem
          textVariant="body"
          mb={12}
          label="APY"
          value={<Text>{formatPercentage(lyraStaking.apy, true)}</Text>}
        />
        <StakeFormButton amount={amount} onClose={onClose} />
      </ModalBody>
    </Modal>
  )
}
