import { BigNumber } from '@ethersproject/bignumber'
import Flex, { FlexElement, FlexProps } from '@lyra/ui/components/Flex'
import Text, { TextBaseProps, TextVariant } from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import TokenImage from '@/app/containers/common/TokenImage'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TokenImageStack from '../TokenImageStack'

type Props = {
  tokenNameOrAddress: string | string[]
  amount?: BigNumber | number
  amountRange?: React.ReactNode
  decimals?: number
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
    case 'heading2':
    case 'heroHeading':
    case 'heroTitle':
      return 30
    case 'small':
    case 'smallMedium':
      return 16
    default:
      return 24
  }
}

const getMB = (variant: TextVariant): string => {
  switch (variant) {
    case 'heading':
    case 'heading2':
    case 'heroHeading':
    case 'heroTitle':
      return '2px'
    default:
      return '1px'
  }
}

export default function TokenAmountText({
  tokenNameOrAddress,
  variant = 'body',
  color,
  textAlign,
  as,
  amount,
  amountRange,
  decimals,
  isPercentage,
  isTruncated,
  showSign,
  suffix,
  prefix,
  minDps,
  ...styleProps
}: Props): FlexElement {
  const val = BigNumber.isBigNumber(amount) ? fromBigNumber(amount ?? ZERO_BN, decimals) : amount ?? 0
  const size = getTokenAmountHeightForVariant(variant)
  return (
    <Flex {...styleProps} alignItems="flex-end">
      {Array.isArray(tokenNameOrAddress) ? (
        <TokenImageStack size={size} tokenNameOrAddresses={tokenNameOrAddress} />
      ) : (
        <TokenImage size={size} nameOrAddress={tokenNameOrAddress} />
      )}
      {amount ? (
        <Text mb={getMB(variant)} ml={2} variant={variant} color={color} textAlign={textAlign} as={as}>
          {prefix}
          {isPercentage
            ? formatPercentage(val, !showSign)
            : isTruncated
            ? formatTruncatedNumber(val)
            : formatNumber(val, { minDps })}
          {suffix}
        </Text>
      ) : null}
      {amountRange ? amountRange : null}
    </Flex>
  )
}
