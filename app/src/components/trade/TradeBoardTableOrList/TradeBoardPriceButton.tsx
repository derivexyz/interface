import Button, { ButtonElement } from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import { MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Quote, QuoteDisabledReason } from '@lyrafinance/lyra-js'
import React from 'react'

import emptyFunction from '@/app/utils/emptyFunction'
import getIsQuoteHidden from '@/app/utils/getIsQuoteHidden'

type Props = {
  quote: Quote
  isSelected: boolean
  onSelected: (isSelected: boolean) => void
} & MarginProps

const getDisabledMessage = (disabledReason: QuoteDisabledReason): string => {
  switch (disabledReason) {
    case QuoteDisabledReason.EmptySize:
    case QuoteDisabledReason.EmptyPremium:
    case QuoteDisabledReason.Expired:
    case QuoteDisabledReason.TradingCutoff:
    case QuoteDisabledReason.InsufficientLiquidity:
    case QuoteDisabledReason.DeltaOutOfRange:
      return 'Disabled'
    case QuoteDisabledReason.VolTooHigh:
    case QuoteDisabledReason.VolTooLow:
    case QuoteDisabledReason.IVTooHigh:
      return 'Sell Only'
    case QuoteDisabledReason.IVTooLow:
    case QuoteDisabledReason.SkewTooHigh:
    case QuoteDisabledReason.SkewTooLow:
      return 'Buy Only'
  }
}

const getButtonWidthForMarket = (market: Market) => {
  switch (market.baseToken.symbol.toLowerCase()) {
    case 'btc':
    case 'wbtc':
    case 'sbtc':
      return 150
    default:
      return 136
  }
}

export default function TradeBoardPriceButton({
  quote,
  isSelected,
  onSelected = emptyFunction,
  ...styleProps
}: Props): ButtonElement {
  const { isBuy, disabledReason } = quote
  const isDisabled = disabledReason ? getIsQuoteHidden(disabledReason) : false
  return (
    <Button
      variant={isBuy ? 'primary' : 'error'}
      width={getButtonWidthForMarket(quote.market())}
      showRightIconSeparator={!isDisabled}
      isOutline={!isSelected}
      isDisabled={isDisabled}
      label={isDisabled && disabledReason ? getDisabledMessage(disabledReason) : formatUSD(quote.premium)}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopPropagation()
        onSelected(!isSelected)
      }}
      rightIcon={!isDisabled ? (!isSelected ? IconType.Plus : IconType.Check) : null}
      {...styleProps}
    />
  )
}
