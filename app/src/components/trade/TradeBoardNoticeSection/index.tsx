import Alert from '@lyra/ui/components/Alert'
import { IconType } from '@lyra/ui/components/Icon'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import { Board, MarketLiquidity } from '@lyrafinance/lyra-js'
import React from 'react'

import { MAX_UTILIZATION, OptionQuotesNullable, StrikeQuotesNullable } from '@/app/constants/contracts'
import { TRADING_CUTOFF_DOC_URL } from '@/app/constants/links'

type Props = {
  board: Board
  isGlobalPaused: boolean
  quotes: (StrikeQuotesNullable | OptionQuotesNullable)[]
  marketLiquidity: MarketLiquidity | null
} & MarginProps

export default function TradeBoardNoticeSection({
  board,
  isGlobalPaused,
  quotes,
  marketLiquidity,
  ...marginProps
}: Props) {
  const market = board.market()
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
  } else if (isGlobalPaused || board.isPaused) {
    return (
      <Alert
        icon={IconType.AlertTriangle}
        title="Trading Paused"
        variant="warning"
        description={isGlobalPaused ? 'Trading is paused.' : `Trading for the ${market.name} market is paused.`}
        {...marginProps}
      />
    )
  } else if (marketLiquidity && marketLiquidity.utilization >= MAX_UTILIZATION) {
    return (
      <Alert
        icon={IconType.AlertTriangle}
        title="High Utilization"
        variant="warning"
        description={`The ${market.name} market is ${
          marketLiquidity.utilization === 1 ? 'fully utilized' : 'almost fully utilized'
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
