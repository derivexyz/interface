import Button from '@lyra/ui/components/Button'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

type Props = {
  accountRewardEpoch?: AccountRewardEpoch | null
  onClick: () => void
} & MarginProps &
  LayoutProps

export default function RewardsClaimModalButton({ onClick, accountRewardEpoch, ...styleProps }: Props) {
  const hasClaimableRewards = accountRewardEpoch?.totalClaimableRewards.length
  return (
    <Button
      isDisabled={!hasClaimableRewards}
      label="Claim"
      variant="primary"
      onClick={onClick}
      {...styleProps}
      size="lg"
    />
  )
}
