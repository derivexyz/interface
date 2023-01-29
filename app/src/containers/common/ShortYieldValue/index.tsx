import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text, { TextVariant } from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import filterNulls from '@lyra/ui/utils/filterNulls'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatTruncatedBalance from '@lyra/ui/utils/formatTruncatedBalance'
import { Option, Position, Trade } from '@lyrafinance/lyra-js'
import React from 'react'

import { SHORT_COLLATERAL_REWARDS_DOC_URL } from '@/app/constants/links'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  option: Option
  tradeOrPosition: Trade | Position
  textVariant?: TextVariant
}

const ShortYieldValue = withSuspense(
  ({ option, tradeOrPosition, textVariant }: Props) => {
    const epochs = useLatestRewardEpoch(option.lyra.network)

    const size = tradeOrPosition instanceof Trade ? tradeOrPosition.newSize : tradeOrPosition.size
    const delta = fromBigNumber(tradeOrPosition instanceof Trade ? tradeOrPosition.greeks.delta : option.delta)
    const expiryTimestamp = option.board().expiryTimestamp
    const isLong = tradeOrPosition.isLong
    const market = option.market()
    const yieldPerDay = epochs?.global?.shortCollateralYieldPerDay(
      fromBigNumber(size),
      delta,
      expiryTimestamp,
      market.baseToken.symbol
    )
    const isEnabled = !isLong && size.gt(0) && !!yieldPerDay
    const lyraYieldPerDay =
      yieldPerDay?.find(token => ['lyra', 'stklyra'].includes(token.symbol.toLowerCase()))?.amount ?? 0
    const opYieldPerDay = yieldPerDay?.find(token => ['op'].includes(token.symbol.toLowerCase()))?.amount ?? 0
    const isEarning = yieldPerDay && lyraYieldPerDay + opYieldPerDay > 0

    const rewardsStr = yieldPerDay
      ? filterNulls([
          opYieldPerDay ? formatTruncatedBalance(opYieldPerDay, 'LYRA') : null,
          opYieldPerDay ? formatTruncatedBalance(opYieldPerDay, 'OP') : null,
        ]).join(', ')
      : null

    return (
      <Tooltip
        title="Short Yield"
        tooltip={
          isEnabled ? (
            <Box>
              <Text variant="secondary" color="secondaryText" mb={4}>
                When traders sell options they earn additional rewards on their short collateral.
              </Text>
              <Text variant="secondary" color="secondaryText">
                {tradeOrPosition instanceof Trade
                  ? `By selling this ${option.isCall ? 'call' : 'put'} you will earn`
                  : `You are earning`}{' '}
                an estimated daily rate of{' '}
                <Text as="span" color={isEnabled && isEarning ? 'primaryText' : 'text'}>
                  {formatBalance(opYieldPerDay, 'LYRA', { maxDps: 2 })}
                </Text>{' '}
                and{' '}
                <Text as="span" color={isEnabled && isEarning ? 'primaryText' : 'text'}>
                  {formatBalance(opYieldPerDay, 'OP', { maxDps: 2 })}
                </Text>{' '}
                until the option expires.
              </Text>
            </Box>
          ) : null
        }
        isDisabled={!isEnabled}
        href={SHORT_COLLATERAL_REWARDS_DOC_URL}
        target="_blank"
        placement="top-end"
      >
        <Text variant={textVariant} color={isEnabled && isEarning ? 'primaryText' : 'secondaryText'}>
          {rewardsStr ? rewardsStr : '-'}
        </Text>
      </Tooltip>
    )
  },
  ({ textVariant }) => <TextShimmer variant={textVariant} width={60} />
)

export default ShortYieldValue
