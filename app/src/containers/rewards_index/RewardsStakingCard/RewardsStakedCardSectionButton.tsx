import Button from '@lyra/ui/components/Button'
import Grid from '@lyra/ui/components/Grid'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableStakingRewards from '@/app/hooks/rewards/useClaimableStakingRewards'

type Props = {
  onStakeOpen: () => void
  onUnstakeOpen: () => void
  onClaim: () => void
}

const RewardsStakedCardSectionButton = withSuspense(
  ({ onStakeOpen, onUnstakeOpen, onClaim }: Props) => {
    const claimableStakingRewards = useClaimableStakingRewards()
    return (
      <Grid
        sx={{
          gridTemplateColumns: ['1fr', '1fr 1fr 1fr'],
          gridGap: 3,
        }}
      >
        {claimableStakingRewards.gt(ZERO_BN) ? (
          <Button
            size="lg"
            label="Claim"
            variant="primary"
            isDisabled={!claimableStakingRewards.gt(ZERO_BN)}
            onClick={onClaim}
          />
        ) : null}
        <Button
          size="lg"
          label="Stake"
          variant={claimableStakingRewards.gt(ZERO_BN) ? 'default' : 'primary'}
          onClick={onStakeOpen}
        />
        <Button size="lg" label="Unstake" variant="default" onClick={onUnstakeOpen} />
      </Grid>
    )
  },
  () => {
    return (
      <Grid sx={{ gridTemplateColumns: ['1r', '1fr 1fr'], gridColumnGap: 4, gridRowGap: 4 }}>
        <ButtonShimmer size="lg" width="100%" />
        <ButtonShimmer size="lg" width="100%" />
      </Grid>
    )
  }
)

export default RewardsStakedCardSectionButton
