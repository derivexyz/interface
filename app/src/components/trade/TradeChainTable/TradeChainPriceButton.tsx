import Box from '@lyra/ui/components/Box'
import Button, { ButtonElement } from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Quote } from '@lyrafinance/lyra-js'
import React from 'react'

import emptyFunction from '@/app/utils/emptyFunction'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getIsQuoteHidden from '@/app/utils/getIsQuoteHidden'

type Props = {
  quote: Quote | null // Renders empty button for invalid quotes
  isSelected: boolean
  onSelected: (isSelected: boolean) => void
} & MarginProps

export default function TradeChainPriceButton({
  quote,
  isSelected,
  onSelected = emptyFunction,
  ...styleProps
}: Props): ButtonElement {
  return (
    <Button
      width="100%"
      variant={quote?.isBuy ? 'primary' : 'error'}
      textVariant="secondary"
      size="small"
      isOutline={!isSelected}
      isDisabled={!quote ? true : quote.disabledReason ? getIsQuoteHidden(quote.disabledReason) : false}
      label={
        <Box>
          <Text textAlign="left" variant="secondary">
            {quote ? formatUSD(quote.premium) : 'Disabled'}
          </Text>
          <Text textAlign="left" variant="small" color={!quote || isSelected ? 'inherit' : 'secondaryText'}>
            {quote ? formatPercentage(fromBigNumber(quote.iv), true) : 'N/A'}
          </Text>
        </Box>
      }
      rightIcon={!isSelected ? IconType.Plus : IconType.Check}
      rightIconSpacing={1}
      showRightIconSeparator
      onClick={() => onSelected(!isSelected)}
      {...styleProps}
    />
  )
}
