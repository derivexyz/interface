import Button, { ButtonSize } from '@lyra/ui/components/Button'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

type Props = {
  accountRewardEpoch?: AccountRewardEpoch | null
  size?: ButtonSize
  isDisabled?: boolean
  onClick: () => void
} & MarginProps &
  LayoutProps

export default function RewardsClaimModalButton({
  onClick,
  accountRewardEpoch,
  isDisabled = false,
  size = 'lg',
  ...styleProps
}: Props) {
  const hasClaimableRewards = accountRewardEpoch?.totalClaimableRewards.length && !isDisabled
  return (
    <Button
      isDisabled={!hasClaimableRewards}
      label="Claim"
      variant="primary"
      onClick={onClick}
      {...styleProps}
      size={size}
    />
  )
}
