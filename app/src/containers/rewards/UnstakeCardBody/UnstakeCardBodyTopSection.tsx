import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'
import { Flex } from 'rebass'

import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'

import TokenImage from '../../common/TokenImage'
import UnstakeCardBodyAmountInput from './UnstakeCardBodyAmountInput'

type UnstakeCardBodyTopSectionProps = {
  amount: BigNumber
  onChangeAmount: (amount: BigNumber) => void
} & LayoutProps &
  MarginProps

const UnstakeCardBodyTopSectionBalance = withSuspense(
  () => {
    const lyraAccountStaking = useLyraAccountStaking()
    return (
      <Flex alignItems="center" ml="auto">
        <TokenImage nameOrAddress="stkLyra" />
        <Text variant="body" color="secondaryText" ml={2}>
          {formatNumber(lyraAccountStaking?.lyraBalances.ethereumStkLyra ?? 0)}
        </Text>
      </Flex>
    )
  },
  () => {
    return <TextShimmer variant="body" ml="auto" />
  }
)

const UnstakeCardBodyTopSectionInput = withSuspense(
  ({ amount, onChangeAmount, ...styleProps }: UnstakeCardBodyTopSectionProps) => {
    const lyraAccountStaking = useLyraAccountStaking()
    const maxStakeBalance = lyraAccountStaking?.lyraBalances.ethereumStkLyra ?? ZERO_BN
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
    <CardSection {...styleProps}>
      <Text variant="body" color="secondaryText" width="100%" mb={4}>
        Your staked LYRA can now be unstaked. If you do not unstake within 2 days, the staking period resets and you'll
        have to wait 14 days.
      </Text>
      <Flex width="100%" my={4}>
        <Text variant="body" color="secondaryText">
          Unstakeable Balance
        </Text>
        <UnstakeCardBodyTopSectionBalance />
      </Flex>
      <Flex width="100%" mb={4}>
        <Text variant="body" color="secondaryText" sx={{ alignSelf: 'center' }}>
          Amount to Unstake
        </Text>
        <UnstakeCardBodyTopSectionInput amount={amount} onChangeAmount={onChangeAmount} />
      </Flex>
    </CardSection>
  )
}

export default UnstakeCardBodyTopSection
