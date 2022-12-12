import { BigNumber } from '@ethersproject/bignumber'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React from 'react'
import { Flex } from 'rebass'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'

import StakeFormAmountInput from './StakeCardBodyAmountInput'

type StakeCardBodyTopSectionProps = {
  amount: BigNumber
  onChangeAmount: (amount: BigNumber) => void
} & LayoutProps &
  MarginProps

const StakeCardBodyTopSectionBalance = withSuspense(
  () => {
    const lyraAccountStaking = useLyraAccountStaking()
    return <TokenAmountText tokenNameOrAddress="lyra" amount={lyraAccountStaking?.lyraBalance.balance ?? 0} />
  },
  () => {
    return <TokenAmountTextShimmer />
  }
)

const StakeCardBodyTopSectionInput = withSuspense(
  ({ amount, onChangeAmount }: StakeCardBodyTopSectionProps) => {
    const lyraAccountStaking = useLyraAccountStaking()
    const maxStakeBalance = lyraAccountStaking?.lyraBalance.balance ?? ZERO_BN
    return (
      <StakeFormAmountInput amount={amount} max={maxStakeBalance} onChangeAmount={onChangeAmount} ml="auto" mr={-3} />
    )
  },
  () => {
    return <ButtonShimmer ml="auto" size="md" />
  }
)

const StakeCardBodyTopSection = ({ amount, onChangeAmount, ...styleProps }: StakeCardBodyTopSectionProps) => {
  return (
    <ModalSection variant="elevated" {...styleProps}>
      <Text variant="body" color="secondaryText" width="100%" mb={4}>
        By staking LYRA you earn stkLYRA and OP rewards and you receive boosts on your vault and trading rewards. LYRA
        rewards are locked for 6 months. Staked LYRA has a 14 day unstaking period.
      </Text>
      <Flex width="100%" my={4} justifyContent="space-between">
        <Text variant="body" color="secondaryText">
          Stakeable Balance
        </Text>
        <StakeCardBodyTopSectionBalance />
      </Flex>
      <Flex width="100%" mb={4}>
        <Text variant="body" color="secondaryText" sx={{ alignSelf: 'center' }}>
          Amount to Stake
        </Text>
        <StakeCardBodyTopSectionInput amount={amount} onChangeAmount={onChangeAmount} />
      </Flex>
    </ModalSection>
  )
}

export default StakeCardBodyTopSection
