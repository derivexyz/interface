import { BigNumber } from '@ethersproject/bignumber'
import Text, { TextElement, TextProps } from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  prevAmount: BigNumber | number
  newAmount: BigNumber | number
  decimals?: number
  isUSDFormat?: boolean
  isPercentFormat?: boolean
  symbol?: string
  prefix?: string
} & TextProps

const AmountUpdateText = ({
  prevAmount: prevAmountBNOrNum,
  newAmount: newAmountBNOrNum,
  decimals,
  symbol,
  isUSDFormat,
  isPercentFormat,
  color,
  prefix,
  ...textProps
}: Props): TextElement => {
  const prevAmount = BigNumber.isBigNumber(prevAmountBNOrNum)
    ? fromBigNumber(prevAmountBNOrNum, decimals)
    : prevAmountBNOrNum
  const newAmount = BigNumber.isBigNumber(newAmountBNOrNum)
    ? fromBigNumber(newAmountBNOrNum, decimals)
    : newAmountBNOrNum
  let formattedPrevAmount = formatNumber(prevAmount)
  let formattedNewAmount = formatNumber(newAmount < 0 ? 0 : newAmount)
  if (isUSDFormat) {
    formattedPrevAmount = formatUSD(prevAmount)
    formattedNewAmount = formatUSD(newAmount < 0 ? 0 : newAmount)
  }
  if (isPercentFormat) {
    formattedPrevAmount = formatPercentage(prevAmount, true)
    formattedNewAmount = formatPercentage(newAmount, true)
  }
  const prefixWithSpace = prefix ? `${prefix} ` : prefix
  return (
    <Text color={color} {...textProps}>
      <Text
        as="span"
        sx={{
          textDecoration: prevAmount > 0 && prevAmount !== newAmount ? 'line-through' : 'auto',
        }}
      >
        {prefixWithSpace}
        {formattedPrevAmount}
      </Text>
      {newAmount > 0 && prevAmount !== newAmount ? (
        <Text as="span">
          &nbsp;→&nbsp;
          {prefixWithSpace}
          {formattedNewAmount}
        </Text>
      ) : null}
      {symbol ? (
        <Text
          as="span"
          sx={{
            textDecoration: prevAmount > 0 && newAmount <= 0 ? 'line-through' : 'auto',
          }}
        >
          &nbsp;{symbol}
        </Text>
      ) : null}
    </Text>
  )
}

export default AmountUpdateText
