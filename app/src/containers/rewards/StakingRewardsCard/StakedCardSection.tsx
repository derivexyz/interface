import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React, { useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { ZERO_BN } from '@/app/constants/bn'
import UnstakeModal from '@/app/containers/rewards/UnstakeModal'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'
import useClaimableStakingRewards from '@/app/hooks/rewards/useClaimableStakingRewards'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'

import ClaimAndMigrateModal from '../ClaimAndMigrateModal'
import ClaimStakingRewardsModal from '../ClaimStakingRewardsModal'
import StakeModal from '../StakeModal'
import StakedCardSectionButton from './StakedCardSectionButton'
import StakedLyraBalanceText from './StakedLyraBalanceText'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
} & MarginProps

const StakingRewardsText = withSuspense(
  (): CardElement => {
    const claimableBalances = useClaimableBalances()
    const claimableStakingRewards = useClaimableStakingRewards()
    let claimableBalance = ZERO_BN
    if (claimableBalances.oldStkLyra.gt(ZERO_BN)) {
      claimableBalance = claimableBalances.oldStkLyra
    } else if (claimableStakingRewards) {
      claimableBalance = claimableStakingRewards
    }
    return <Text>{formatNumber(claimableBalance)} stkLYRA</Text>
  },
  () => <TextShimmer />
)

const StakedCardSection = ({ latestRewardEpochs, ...marginProps }: Props): CardElement => {
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
  const [isL1ClaimOpen, setIsClaimL1Open] = useState(false)
  const [isClaimAndMigrateOpen, setIsClaimAndMigrateOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
      <Text variant="heading" mb={1}>
        Staked
      </Text>
      <StakedLyraBalanceText />
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <LabelItem textVariant="body" label="Claimable Rewards" value={<StakingRewardsText />} />
        <LabelItem
          textVariant="body"
          label="APY"
          value={formatPercentage(latestRewardEpochs[0].global.stakingApy, true)}
        />
      </Grid>
      <StakedCardSectionButton
        onStakeOpen={() => setIsStakeOpen(true)}
        onUnstakeOpen={() => setIsUnstakeOpen(true)}
        onClaimAndMigrateOpen={() => setIsClaimAndMigrateOpen(true)}
        onClaimL1Open={() => setIsClaimL1Open(true)}
      />
      <UnstakeModal isOpen={isUnstakeOpen} onClose={() => setIsUnstakeOpen(false)} />
      <StakeModal
        globalRewardEpoch={latestRewardEpochs[0].global}
        isOpen={isStakeOpen}
        onClose={() => setIsStakeOpen(false)}
      />
      <ClaimAndMigrateModal isOpen={isClaimAndMigrateOpen} onClose={() => setIsClaimAndMigrateOpen(false)} />
      <ClaimStakingRewardsModal isOpen={isL1ClaimOpen} onClose={() => setIsClaimL1Open(false)} />
    </CardSection>
  )
}

export default StakedCardSection
