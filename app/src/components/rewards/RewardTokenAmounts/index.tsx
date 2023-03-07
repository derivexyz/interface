import Flex from '@lyra/ui/components/Flex'
import Text, { TextColor, TextVariant } from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'

import TokenImageStack from '../../common/TokenImageStack'

type Props = {
  tokenAmounts: RewardEpochTokenAmount[]
  size?: number
  color?: TextColor
  variant?: TextVariant
  showDash?: boolean
  hideZeroAmounts?: boolean
  hideTokenImages?: boolean
} & MarginProps

export default function RewardTokenAmounts({
  tokenAmounts,
  color = 'text',
  size = 24,
  variant = 'body',
  showDash = true,
  hideTokenImages = false,
  hideZeroAmounts = false,
  ...styleProps
}: Props) {
  const rewardsText = useMemo(
    () =>
      tokenAmounts
        .filter(t => !hideZeroAmounts || t.amount > 0)
        .map(token => `${formatNumber(token.amount, { maxDps: 2 })} ${token.symbol}`)
        .join(', '),
    [tokenAmounts, hideZeroAmounts]
  )

  if ((showDash && rewardsText === '') || tokenAmounts.length === 0) {
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
      <Text color={color} variant={variant}>
        {rewardsText}
      </Text>
    </Flex>
  )
}
