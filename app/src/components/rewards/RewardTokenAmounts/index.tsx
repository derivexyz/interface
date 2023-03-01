import Flex from '@lyra/ui/components/Flex'
import Text, { TextVariant } from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'

import TokenImageStack from '../../common/TokenImageStack'

type Props = {
  tokenAmounts: RewardEpochTokenAmount[]
  size?: number
  variant?: TextVariant
  showDash?: boolean
  hideZeroAmount?: boolean
  hideTokenImages?: boolean
} & MarginProps

export default function RewardTokenAmounts({
  tokenAmounts,
  size = 24,
  variant = 'body',
  showDash = true,
  hideTokenImages = false,
  hideZeroAmount = false,
  ...styleProps
}: Props) {
  const rewardsText = useMemo(
    () => tokenAmounts.map(token => `${formatNumber(token.amount)} ${token.symbol}`).join(', '),
    [tokenAmounts]
  )
  const isRewardAmountZero = tokenAmounts.reduce((totalAmount, tokenAmount) => totalAmount + tokenAmount.amount, 0) <= 0

  if (showDash && (tokenAmounts.length === 0 || (hideZeroAmount && isRewardAmountZero))) {
    return (
      <Text variant={variant} {...styleProps}>
        -
      </Text>
    )
  }

  return (
    <Flex alignItems="center" {...styleProps}>
      {!hideTokenImages ? (
        <TokenImageStack mr={2} size={size} tokenNameOrAddresses={tokenAmounts.map(t => t.symbol)} />
      ) : null}
      <Text variant={variant}>{rewardsText}</Text>
    </Flex>
  )
}
