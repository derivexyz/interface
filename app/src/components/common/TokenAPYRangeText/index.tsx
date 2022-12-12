import Flex, { FlexElement, FlexProps } from '@lyra/ui/components/Flex'
import Text, { TextBaseProps, TextVariant } from '@lyra/ui/components/Text'
import React from 'react'

import TokenImage from '@/app/containers/common/TokenImage'

import TokenImageStack from '../TokenImageStack'

type Props = {
  tokenNameOrAddress: string | string[]
  leftValue?: React.ReactNode
  rightValue?: React.ReactNode
  isTruncated?: boolean
} & TextBaseProps &
  FlexProps

export const getTokenAPYRangeHeightForVariant = (variant: TextVariant): number => {
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

export default function TokenAPYRangeText({
  tokenNameOrAddress,
  variant = 'body',
  color,
  textAlign,
  as,
  leftValue,
  rightValue,
  ...styleProps
}: Props): FlexElement {
  const size = getTokenAPYRangeHeightForVariant(variant)
  return (
    <Flex {...styleProps} alignItems="flex-end">
      {Array.isArray(tokenNameOrAddress) ? (
        <TokenImageStack size={size} tokenNameOrAddresses={tokenNameOrAddress} />
      ) : (
        <TokenImage size={size} nameOrAddress={tokenNameOrAddress} />
      )}
      <Text mb={getMB(variant)} ml={1} variant={variant} color={color} textAlign={textAlign} as={as}>
        {leftValue} - {rightValue}
      </Text>
    </Flex>
  )
}
