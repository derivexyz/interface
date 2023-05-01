import Button from '@lyra/ui/components/Button'
import Grid from '@lyra/ui/components/Grid'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

type Props = {
  lyraStaking: LyraStaking
  onStakeOpen: () => void
  onUnstakeOpen: () => void
  onClaim: () => void
}

const RewardsStakedCardSectionButton = ({ lyraStaking, onStakeOpen, onUnstakeOpen, onClaim }: Props) => {
  const { claimableRewards } = lyraStaking
  return (
    <Grid
      sx={{
        gridTemplateColumns: ['1fr', '1fr 1fr 1fr'],
        gridGap: 3,
      }}
    >
      {claimableRewards.gt(ZERO_BN) ? (
        <Button
          size="lg"
          label="Claim"
          variant="primary"
          isDisabled={!claimableRewards.gt(ZERO_BN)}
          onClick={onClaim}
        />
      ) : null}
      <Button
        size="lg"
        label="Stake"
        variant={claimableRewards.gt(ZERO_BN) ? 'default' : 'primary'}
        onClick={onStakeOpen}
      />
      <Button size="lg" label="Unstake" variant="default" onClick={onUnstakeOpen} />
    </Grid>
  )
}

export default RewardsStakedCardSectionButton
