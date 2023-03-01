import Alert from '@lyra/ui/components/Alert'
import { IconType } from '@lyra/ui/components/Icon'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraStakingAccount from '@/app/hooks/rewards/useLyraAccountStaking'

import UnstakeCardBodyButton from './UnstakeCardBodyButton'

type Props = LayoutProps & MarginProps

const UnstakeCardBodyRequestUnstakeSectionBalance = withSuspense(
  () => {
    const lyraBalances = useAccountLyraBalances()
    return <Text>{formatNumber(lyraBalances.ethereumStkLyra)} stkLYRA</Text>
  },
  () => <TextShimmer width={60} />
)

const UnstakeCardBodyRequestUnstakeSectionCountdown = withSuspense(
  () => {
    const lyraAccountStaking = useLyraStakingAccount()
    return <Countdown timestamp={lyraAccountStaking?.unstakeWindowStartTimestamp ?? 0} fallback="14d" ml="auto" />
  },
  () => <TextShimmer width={40} />
)

const UnstakeCardBodyRequestUnstakeSection = ({ ...styleProps }: Props) => {
  return (
    <ModalSection {...styleProps}>
      <Text variant="body" color="secondaryText" width="100%" mb={10}>
        Staked LYRA has a 14 day unstaking period. Boosts for vault and trading rewards will also be disabled.
      </Text>
      <RowItem
        textVariant="body"
        mb={6}
        label="Staked Balance"
        value={<UnstakeCardBodyRequestUnstakeSectionBalance />}
      />
      <RowItem
        textVariant="body"
        mb={8}
        label="Unstakeable In"
        value={<UnstakeCardBodyRequestUnstakeSectionCountdown />}
      />
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
