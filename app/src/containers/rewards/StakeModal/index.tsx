import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React from 'react'
import { useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'

import StakeFormAmountInput from './StakeFormAmountInput'
import StakeFormButton from './StakeFormButton'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  isOpen: boolean
  onClose: () => void
}

type StakeCardBodyTopSectionProps = {
  amount: BigNumber
  onChangeAmount: (amount: BigNumber) => void
}
const StakeCardBalanceText = withSuspense(
  () => {
    const lyraBalances = useAccountLyraBalances()
    return <Text>{formatNumber(lyraBalances.ethereumLyra)} LYRA</Text>
  },
  () => <TokenAmountTextShimmer width={50} />
)

const StakeCardInput = withSuspense(
  ({ amount, onChangeAmount }: StakeCardBodyTopSectionProps) => {
    const lyraBalances = useAccountLyraBalances()
    const maxStakeBalance = lyraBalances.ethereumLyra
    return (
      <StakeFormAmountInput amount={amount} max={maxStakeBalance} onChangeAmount={onChangeAmount} ml="auto" mr={-3} />
    )
  },
  () => {
    return <ButtonShimmer ml="auto" size="md" />
  }
)

export default function StakeModal({ isOpen, onClose, globalRewardEpoch }: Props) {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  return (
    <Modal noPadding isOpen={isOpen} onClose={onClose} title="Stake LYRA" centerTitle>
      <ModalBody variant="elevated">
        <Text variant="body" color="secondaryText" width="100%" mb={10}>
          By staking LYRA you earn stkLYRA rewards and you receive boosts on your vault and trading rewards. Staked LYRA
          has a 14 day unstaking period.
        </Text>
        <RowItem
          textVariant="body"
          label="Amount to Stake"
          value={<StakeCardInput amount={amount} onChangeAmount={amount => setAmount(amount)} />}
        />
        <RowItem textVariant="body" my={6} label="Balance" value={<StakeCardBalanceText />} />
        <RowItem
          textVariant="body"
          mb={12}
          label="APY"
          value={<Text>{formatPercentage(globalRewardEpoch.stakingApy, true)}</Text>}
        />
        <StakeFormButton amount={amount} onClose={onClose} />
      </ModalBody>
    </Modal>
  )
}
