import { BigNumber } from '@ethersproject/bignumber'
import Flex, { FlexElement, FlexProps } from '@lyra/ui/components/Flex'
import Text, { TextBaseProps, TextVariant } from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import TokenImage from '@/app/containers/common/TokenImage'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TokenImageStack from '../TokenImageStack'

type Props = {
  tokenNameOrAddress: string | string[]
  tokenImageSize?: number
  tokenSymbol?: string
  amount: BigNumber | number
  decimals?: number
  isDollars?: boolean
  isTruncated?: boolean
  isPercentage?: boolean
  showSign?: boolean
  suffix?: string
  prefix?: string
  minDps?: number
} & TextBaseProps &
  FlexProps

export const getTokenAmountHeightForVariant = (variant: TextVariant): number => {
  switch (variant) {
    case 'heading':
    case 'cardHeading':
      return 30
    case 'small':
      return 16
    default:
      return 24
  }
}

export default function TokenAmountText({
  tokenNameOrAddress,
  tokenImageSize,
  tokenSymbol,
  variant = 'body',
  color,
  textAlign,
  as,
  amount,
  decimals,
  isDollars,
  isPercentage,
  isTruncated,
  showSign,
  suffix,
  prefix,
  minDps,
  ...styleProps
}: Props): FlexElement {
  const val = BigNumber.isBigNumber(amount) ? fromBigNumber(amount, decimals) : amount
  const size = tokenImageSize ?? getTokenAmountHeightForVariant(variant)
  return (
    <Flex {...styleProps} alignItems="center">
      {Array.isArray(tokenNameOrAddress) ? (
        <TokenImageStack size={size} tokenNameOrAddresses={tokenNameOrAddress} />
      ) : (
        <TokenImage size={size} nameOrAddress={tokenNameOrAddress} />
      )}
      <Text ml={2} variant={variant} color={color} textAlign={textAlign} as={as}>
        {prefix}
        {isPercentage
          ? formatPercentage(val, !showSign)
          : isDollars
          ? isTruncated
            ? formatTruncatedUSD(val, { showSign })
            : formatUSD(val, { showSign })
          : isTruncated
          ? formatTruncatedNumber(val)
          : formatNumber(val, { minDps })}
        {tokenSymbol ? ` ${tokenSymbol}` : ''}
        {suffix}
      </Text>
    </Flex>
  )
}
