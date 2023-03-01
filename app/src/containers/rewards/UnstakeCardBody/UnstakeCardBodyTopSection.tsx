import { BigNumber } from '@ethersproject/bignumber'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'

import UnstakeCardBodyAmountInput from './UnstakeCardBodyAmountInput'

type UnstakeCardBodyTopSectionProps = {
  amount: BigNumber
  onChangeAmount: (amount: BigNumber) => void
} & LayoutProps &
  MarginProps

const UnstakeCardBodyTopSectionBalance = withSuspense(
  () => {
    const lyraBalances = useAccountLyraBalances()
    return <Text>{formatNumber(lyraBalances.ethereumStkLyra)} stkLYRA</Text>
  },
  () => <TextShimmer variant="body" width={60} />
)

const UnstakeCardBodyTopSectionInput = withSuspense(
  ({ amount, onChangeAmount, ...styleProps }: UnstakeCardBodyTopSectionProps) => {
    const lyraBalances = useAccountLyraBalances()
    const maxStakeBalance = lyraBalances.ethereumStkLyra
    return (
      <UnstakeCardBodyAmountInput
        {...styleProps}
        amount={amount}
        max={maxStakeBalance}
        onChangeAmount={onChangeAmount}
        ml="auto"
        mr={-3}
      />
    )
  },
  ({ amount, onChangeAmount, ...styleProps }: UnstakeCardBodyTopSectionProps) => {
    return <ButtonShimmer {...styleProps} ml="auto" size="md" />
  }
)

const UnstakeCardBodyTopSection = ({ amount, onChangeAmount, ...styleProps }: UnstakeCardBodyTopSectionProps) => {
  return (
    <ModalSection {...styleProps}>
      <Text variant="body" color="secondaryText" width="100%" mb={10}>
        Your staked LYRA can now be unstaked. If you do not unstake within 2 days, the staking period resets and you'll
        have to wait 14 days.
      </Text>
      <RowItem
        mb={6}
        textVariant="body"
        label="Amount to Unstake"
        value={<UnstakeCardBodyTopSectionInput amount={amount} onChangeAmount={onChangeAmount} />}
      />
      <RowItem textVariant="body" label="Staked Balance" value={<UnstakeCardBodyTopSectionBalance />} />
    </ModalSection>
  )
}

export default UnstakeCardBodyTopSection
