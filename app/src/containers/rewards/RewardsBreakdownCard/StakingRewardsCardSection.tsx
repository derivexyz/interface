import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountRewardEpochs from '@/app/hooks/rewards/useAccountRewardEpochs'
import useLatestRewardEpochs from '@/app/hooks/rewards/useLatestRewardEpochs'

type Props = MarginProps

const StakingRewardsCardGridItems = withSuspense(
  (): CardElement => {
    const accountRewardEpoch = useLatestRewardEpochs()?.account
    const accountRewardEpochs = useAccountRewardEpochs()
    const opRewards = accountRewardEpoch?.stakingRewards?.op ?? 0
    const lyraRewards = useMemo(
      () => accountRewardEpochs.reduce((sum, epoch) => sum + epoch.stakingRewards.lyra, 0),
      [accountRewardEpochs]
    )
    return (
      <>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Pending stkLYRA (Locked)
          </Text>
          <TokenAmountText tokenNameOrAddress="stkLyra" variant="secondary" amount={lyraRewards} />
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Pending OP
          </Text>
          <TokenAmountText tokenNameOrAddress="op" variant="secondary" amount={opRewards} />
        </Box>
      </>
    )
  },
  () => {
    return (
      <Box>
        <TextShimmer variant="secondary" mb={2} />
        <TokenAmountTextShimmer variant="secondary" width={150} />
      </Box>
    )
  }
)

const StakingRewardsCardSection = ({ ...marginProps }: Props): CardElement => {
  const isMobile = useIsMobile()
  return (
    <CardSection {...marginProps}>
      <Text mb={8} variant="heading">
        Staking Rewards
      </Text>
      <Grid mb={8} sx={{ gridTemplateColumns: `${isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr'}`, gridColumnGap: 4 }}>
        <StakingRewardsCardGridItems />
      </Grid>
      <Text maxWidth={['100%', '75%']} variant="secondary" color="secondaryText">
        Lyra's staking program rewards LYRA stakers with additional Staked LYRA and OP tokens. Staked LYRA rewards are
        locked for 6 months and OP rewards are claimable every 2 weeks.
      </Text>
    </CardSection>
  )
}

export default StakingRewardsCardSection
