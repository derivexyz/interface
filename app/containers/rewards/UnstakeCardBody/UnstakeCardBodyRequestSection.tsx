import Alert from '@lyra/ui/components/Alert'
import { IconType } from '@lyra/ui/components/Icon'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React from 'react'
import { Flex } from 'rebass'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'

import UnstakeCardBodyButton from './UnstakeCardBodyButton'

type Props = LayoutProps & MarginProps

const UnstakeCardBodyRequestUnstakeSectionBalance = withSuspense(
  () => {
    const lyraAccountStaking = useLyraAccountStaking()
    return (
      <TokenAmountText tokenNameOrAddress={'stkLyra'} amount={lyraAccountStaking?.stakedLyraBalance.balance ?? 0} />
    )
  },
  () => <TokenAmountTextShimmer />
)

const UnstakeCardBodyRequestUnstakeSectionCountdown = withSuspense(
  () => {
    const lyraAccountStaking = useLyraAccountStaking()
    return <Countdown timestamp={lyraAccountStaking?.unstakeWindowStartTimestamp ?? 0} fallback="14d" ml="auto" />
  },
  () => {
    return <TextShimmer />
  }
)

const UnstakeCardBodyRequestUnstakeSection = ({ ...styleProps }: Props) => {
  return (
    <ModalSection {...styleProps}>
      <Text variant="body" color="secondaryText" width="100%" mb={4}>
        Staked LYRA has a 14 day unstaking period. During this period you will not receive any staking LYRA and OP
        rewards and boosts for vault and trading rewards will be disabled.
      </Text>
      <Flex width="100%" my={4} alignItems="center" justifyContent="space-between">
        <Text variant="body" color="secondaryText">
          Unstakeable Balance
        </Text>
        <UnstakeCardBodyRequestUnstakeSectionBalance />
      </Flex>
      <Flex width="100%" mb={8} alignItems="center" justifyContent="space-between">
        <Text variant="body" color="secondaryText">
          Unstakeable In
        </Text>
        <UnstakeCardBodyRequestUnstakeSectionCountdown />
      </Flex>
      <Alert
        mb={3}
        variant="warning"
        title="Warning"
        icon={IconType.AlertTriangle}
        description={
          'After the 14 day unstaking period you have a 2 day window to unstake your LYRA. If you miss this window you have to wait another 14 days.'
        }
      />
      <UnstakeCardBodyButton />
    </ModalSection>
  )
}

export default UnstakeCardBodyRequestUnstakeSection
