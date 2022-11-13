import Box from '@lyra/ui/components/Box'
import Button, { ButtonElement } from '@lyra/ui/components/Button'
import Text from '@lyra/ui/components/Text'
import useFontSize from '@lyra/ui/hooks/useFontSize'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Quote } from '@lyrafinance/lyra-js'
import React from 'react'

import emptyFunction from '@/app/utils/emptyFunction'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  quote: Quote
  isBid: boolean
  isSelected: boolean
  onSelected: (isSelected: boolean) => void
} & MarginProps

export default function TradeChainPriceButton({
  quote,
  isSelected,
  isBid,
  onSelected = emptyFunction,
  ...styleProps
}: Props): ButtonElement {
  const secondaryLineHeight = useFontSize('secondary')
  const smallLineHeight = useFontSize('small')
  return (
    <Button
      minHeight={42}
      variant={isBid ? 'error' : 'primary'}
      textVariant="secondary"
      isTransparent={!isSelected}
      isDisabled={quote.isDisabled}
      label={
        <Box>
          <Text variant="secondary" sx={{ lineHeight: `${secondaryLineHeight}px` }}>
            {formatUSD(quote.premium)} {!isSelected ? '+' : '✓'}
          </Text>
          <Text
            mt={1}
            textAlign="left"
            variant="small"
            color={isSelected ? 'inherit' : 'secondaryText'}
            sx={{ lineHeight: `${smallLineHeight}px` }}
          >
            {formatPercentage(fromBigNumber(quote.iv), true)}
          </Text>
        </Box>
      }
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopPropagation()
        onSelected(!isSelected)
      }}
      {...styleProps}
    />
  )
}
