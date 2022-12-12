import { BigNumber } from '@ethersproject/bignumber'
import Text, { TextElement, TextProps } from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  prevAmount: BigNumber
  newAmount: BigNumber
  isUSDFormat?: boolean
  isPercentFormat?: boolean
  symbol?: string
} & TextProps

const AmountUpdateText = ({
  prevAmount,
  newAmount,
  symbol,
  isUSDFormat,
  isPercentFormat,
  color,
  ...textProps
}: Props): TextElement => {
  let formattedPrevAmount = formatNumber(prevAmount)
  let formattedNewAmount = formatNumber(newAmount.lt(0) ? 0 : newAmount)
  if (isUSDFormat) {
    formattedPrevAmount = formatUSD(prevAmount)
    formattedNewAmount = formatUSD(newAmount.lt(0) ? 0 : newAmount)
  }
  if (isPercentFormat) {
    formattedPrevAmount = formatPercentage(fromBigNumber(prevAmount), true)
    formattedNewAmount = formatPercentage(fromBigNumber(newAmount), true)
  }
  return (
    <Text color={color} {...textProps}>
      <Text
        as="span"
        sx={{
          textDecoration: prevAmount.gt(0) && !prevAmount.eq(newAmount) ? 'line-through' : 'auto',
        }}
      >
        {formattedPrevAmount}
        {newAmount.lte(0) ? ` ${symbol}` : ''}
      </Text>
      {newAmount.gt(0) && !prevAmount.eq(newAmount) ? (
        <Text as="span">
          &nbsp;→&nbsp;
          {formattedNewAmount}
          &nbsp;{symbol}
        </Text>
      ) : null}
    </Text>
  )
}

export default AmountUpdateText
