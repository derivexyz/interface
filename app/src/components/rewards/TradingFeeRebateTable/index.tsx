import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { GlobalRewardEpochTradingFeeRebateTier } from '@lyrafinance/lyra-js'
import React from 'react'

import RowItem from '../../common/RowItem'

type Props = {
  feeRebateTiers: GlobalRewardEpochTradingFeeRebateTier[]
  effectiveRebate?: number
} & MarginProps &
  LayoutProps

export function TradingFeeRebateTable({ effectiveRebate, feeRebateTiers, ...styleProps }: Props) {
  return (
    <Flex flexDirection="column">
      <RowItem
        mb={2}
        label={<Text color="secondaryText">Staked LYRA</Text>}
        value={<Text color="secondaryText">Rebate</Text>}
      />
      <Flex flexDirection="column" {...styleProps}>
        {feeRebateTiers.map(feeRebateTier => (
          <RowItem
            my={2}
            width="100%"
            key={feeRebateTier.stakedLyraCutoff}
            label={
              <Text color={effectiveRebate === feeRebateTier.feeRebate ? 'primaryText' : 'text'}>
                {formatNumber(feeRebateTier.stakedLyraCutoff)}
              </Text>
            }
            value={
              <Text color={effectiveRebate === feeRebateTier.feeRebate ? 'primaryText' : 'text'}>
                {formatPercentage(feeRebateTier.feeRebate, true)}
              </Text>
            }
          />
        ))}
      </Flex>
    </Flex>
  )
}
