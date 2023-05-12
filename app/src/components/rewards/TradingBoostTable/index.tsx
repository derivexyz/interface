import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

import RowItem from '../../common/RowItem'

type Props = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  boost: number
} & MarginProps &
  LayoutProps

export function TradingBoostTable({ latestGlobalRewardEpoch, boost, ...styleProps }: Props) {
  const boostTiers = latestGlobalRewardEpoch.tradingBoostTiers
  const currentTier = boostTiers?.sort((a, b) => b.boost - a.boost).find(tier => tier.boost <= boost)?.boost
  return (
    <Flex flexDirection="column">
      <RowItem
        mb={2}
        label={<Text color="secondaryText">Staked LYRA / Rank / Is Referred</Text>}
        value={<Text color="secondaryText">Boost</Text>}
      />
      <Flex flexDirection="column" {...styleProps}>
        {boostTiers
          ?.sort((a, b) => a.boost - b.boost)
          .map(boostTier => (
            <RowItem
              my={2}
              width="100%"
              key={boostTier.stakingCutoff}
              label={<Text color={currentTier === boostTier.boost ? 'primaryText' : 'text'}>{boostTier.label}</Text>}
              value={
                <Text color={currentTier === boostTier.boost ? 'primaryText' : 'text'}>
                  {formatNumber(boostTier.boost)}x
                </Text>
              }
            />
          ))}
      </Flex>
    </Flex>
  )
}
