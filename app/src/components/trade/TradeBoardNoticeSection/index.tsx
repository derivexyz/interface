import Alert from '@lyra/ui/components/Alert'
import { IconType } from '@lyra/ui/components/Icon'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import { Board } from '@lyrafinance/lyra-js'
import React from 'react'

import { UNIT } from '@/app/constants/bn'
import { MAX_UTILIZATION, OptionQuotesNullable, StrikeQuotesNullable } from '@/app/constants/contracts'
import { TRADING_CUTOFF_DOC_URL } from '@/app/constants/links'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'

type Props = {
  board: Board
  quotes: (StrikeQuotesNullable | OptionQuotesNullable)[]
} & MarginProps

export default function TradeBoardNoticeSection({ board, quotes, ...marginProps }: Props) {
  const market = board.market()

  const isGlobalPaused = market.params.isGlobalPaused
  const isMarketPaused = market.params.isMarketPaused
  const isBoardPaused = board.params.isBoardPaused

  const utilization = market.params.NAV.gt(0)
    ? fromBigNumber(market.params.NAV.sub(market.params.freeLiquidity).mul(UNIT).div(market.params.NAV))
    : 0

  if (board.isTradingCutoff || board.isExpired) {
    return (
      <Alert
        icon={IconType.AlertTriangle}
        title="Trading Cutoff"
        variant="default"
        description={`Trading ends ${formatTruncatedDuration(
          board.expiryTimestamp - board.tradingCutoffTimestamp
        )} before
              expiration. Traders can still close their positions for this expiry.`}
        linkHref={TRADING_CUTOFF_DOC_URL}
        {...marginProps}
      />
    )
  } else if (board.isPaused) {
    return (
      <Alert
        icon={IconType.AlertTriangle}
        title="Trading Paused"
        variant="warning"
        description={
          isGlobalPaused
            ? 'Trading is paused'
            : isMarketPaused
            ? `${getMarketDisplayName(market)} trading is paused`
            : isBoardPaused
            ? `${getMarketDisplayName(market)} trading for ${formatDate(board.expiryTimestamp, true)} expiry is paused`
            : ''
        }
        {...marginProps}
      />
    )
  } else if (utilization >= MAX_UTILIZATION) {
    return (
      <Alert
        icon={IconType.AlertTriangle}
        title="High Utilization"
        variant="warning"
        description={`The ${getMarketDisplayName(market)} market is ${
          utilization === 1 ? 'fully utilized' : 'almost fully utilized'
        }. When a vault is fully utilized new positions cannot be opened. Traders can still close their ${
          market.name
        } positions.`}
        {...marginProps}
      />
    )
  } else if (!quotes.length) {
    return (
      <Alert
        icon={IconType.Info}
        title="No Available Strikes"
        description="This expiry has no available strikes in delta range. Traders can still close their positions for this expiry."
        linkHref={TRADING_CUTOFF_DOC_URL}
        {...marginProps}
      />
    )
  } else {
    return null
  }
}
