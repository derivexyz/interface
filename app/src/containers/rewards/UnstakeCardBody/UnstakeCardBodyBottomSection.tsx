import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Shimmer from '@lyra/ui/components/Shimmer'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'
import { Flex } from 'rebass'

import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraStakingAccount from '@/app/hooks/rewards/useLyraAccountStaking'
import useMarkets from '@/app/hooks/rewards/useMarkets'

import UnstakeCardBodyButton from './UnstakeCardBodyButton'

type UnstakeCardBodyBottomSectionProps = {
  amount: BigNumber
  onClose: () => void
} & LayoutProps &
  MarginProps

const UnstakeCardBodyBottomSection = withSuspense(
  ({ amount, onClose, ...styleProps }: UnstakeCardBodyBottomSectionProps) => {
    const markets = useMarkets()
    const lyraAccountStaking = useLyraStakingAccount()
    const currentTimestamp = useMemo(() => markets[0].block.timestamp, [markets])
    const unstakeWindowEndTimestamp = lyraAccountStaking?.unstakeWindowEndTimestamp ?? 0

    return (
      <CardSection {...styleProps}>
        {unstakeWindowEndTimestamp > currentTimestamp ? (
          <Flex width="100%" mb={8} alignItems="center" justifyContent="space-between">
            <Text variant="body" color="secondaryText">
              Time to Unstake ends in
            </Text>
            <Countdown timestamp={unstakeWindowEndTimestamp} showSeconds fallback="Less than 2 days" ml="auto" />
          </Flex>
        ) : null}
        <UnstakeCardBodyButton amount={amount} onClose={onClose} />
      </CardSection>
    )
  },
  ({ amount, onClose, ...styleProps }: UnstakeCardBodyBottomSectionProps) => {
    return (
      <CardSection {...styleProps}>
        <Flex width="100%" mb={8} alignItems="center">
          <Shimmer height={30} width={150} />
          <TextShimmer variant="body" ml="auto" />
        </Flex>
        <ButtonShimmer width="100%" size="lg" />
      </CardSection>
    )
  }
)

export default UnstakeCardBodyBottomSection
