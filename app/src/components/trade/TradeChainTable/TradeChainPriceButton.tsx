import Box from '@lyra/ui/components/Box'
import Button, { ButtonElement } from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Quote } from '@lyrafinance/lyra-js'
import React from 'react'

import emptyFunction from '@/app/utils/emptyFunction'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getIsQuoteHidden from '@/app/utils/getIsQuoteHidden'

type Props = {
  quote: Quote | null // Renders empty button for invalid quotes
  isSelected: boolean
  onSelected: (isSelected: boolean) => void
} & MarginProps

function getPriceColumnWidth(market: Market) {
  switch (market.baseToken.symbol.toLowerCase()) {
    case 'sbtc':
    case 'wbtc':
      return 118
    case 'eth':
    case 'seth':
    case 'weth':
    default:
      return 106
  }
}

export default function TradeChainPriceButton({
  quote,
  isSelected,
  onSelected = emptyFunction,
  ...styleProps
}: Props): ButtonElement {
  return quote && (!quote.disabledReason || (quote.disabledReason && !getIsQuoteHidden(quote.disabledReason))) ? (
    <Button
      width={getPriceColumnWidth(quote.market())}
      variant={quote?.isBuy ? 'primary' : 'error'}
      size="small"
      isOutline={!isSelected}
      isDisabled={quote.disabledReason ? getIsQuoteHidden(quote.disabledReason) : false}
      label={
        <Box p="1px">
          <Text variant="body" textAlign="left">
            {formatUSD(quote.premium)}
          </Text>
          <Text textAlign="left" variant="small" color={!quote || isSelected ? 'inherit' : 'secondaryText'}>
            {formatPercentage(fromBigNumber(quote.iv), true)}
          </Text>
        </Box>
      }
      rightIcon={!isSelected ? IconType.Plus : IconType.Check}
      rightIconSpacing={1}
      showRightIconSeparator
      onClick={() => onSelected(!isSelected)}
      {...styleProps}
    />
  ) : (
    <Text color="secondaryText">-</Text>
  )
}
