import Button from '@lyra/ui/components/Button'
import Grid from '@lyra/ui/components/Grid'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'
import useClaimableStakingRewards from '@/app/hooks/rewards/useClaimableStakingRewards'

type Props = {
  onStakeOpen: () => void
  onUnstakeOpen: () => void
  onClaimL1Open: () => void
  onClaimAndMigrateOpen: () => void
}

const StakedCardSectionButton = withSuspense(
  ({ onStakeOpen, onUnstakeOpen, onClaimAndMigrateOpen, onClaimL1Open }: Props) => {
    const claimableBalances = useClaimableBalances()
    const claimableStakingRewards = useClaimableStakingRewards()
    const lyraBalances = useAccountLyraBalances()
    const optimismOldStkLyra = lyraBalances.optimismOldStkLyra
    const hasClaimableOldStkLyra = claimableBalances.oldStkLyra.gt(0)
    const hasOldStkLyra = optimismOldStkLyra.gt(0)
    if (hasClaimableOldStkLyra || hasOldStkLyra) {
      return (
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridGap: 3 }}>
          <Button size="lg" label="Migrate" variant="primary" onClick={onClaimAndMigrateOpen} />
        </Grid>
      )
    }
    return (
      <Grid
        sx={{
          gridTemplateColumns: ['1fr', claimableStakingRewards.gt(ZERO_BN) ? '1fr 1fr 1fr' : '1fr 1fr'],
          gridGap: 3,
        }}
      >
        {claimableStakingRewards.gt(ZERO_BN) ? (
          <Button
            size="lg"
            label="Claim"
            variant="primary"
            isDisabled={!claimableStakingRewards.gt(ZERO_BN)}
            onClick={onClaimL1Open}
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

export default StakedCardSectionButton
